import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useMapRuntime } from "./MapRuntime";
import { geofenceToFeature, findFonts } from "./mapUtil";
import { useScada } from "../../../app/remote/ScadaProvider";

type Geofence = {
  id: string | number;
  name?: string | null;
  area?: string | null;
  attributes?: Record<string, any> | null;
};

export function MapGeofence({
  onGeofenceSelected,
}: Readonly<{ onGeofenceSelected?: (id: string | number | null) => void }>) {
  const id = useId();
  const clickOnGeofenceRef = useRef(false);
  const { map, mapReady } = useMapRuntime();
  const { api, config } = useScada();
  const [geofences, setGeofences] = useState<Record<string, Geofence>>({});

  const themeShim = useMemo(
    () => ({ palette: { geometry: { main: config.colorPrimary ?? "#00F1C7" } } }),
    [config.colorPrimary],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await api.get<Geofence[]>("/api/geofences");
        if (!mounted) return;
        const byId: Record<string, Geofence> = {};
        (items ?? []).forEach((g) => {
          if (g?.id == null) return;
          byId[String(g.id)] = g;
        });
        setGeofences(byId);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [api]);

  useEffect(() => {
    if (!mapReady || !map) return;

    const m: any = map;
    if (typeof m?.isStyleLoaded === "function" && !m.isStyleLoaded()) {
      return;
    }
    if (!m.getSource(id)) {
      m.addSource(id, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      } as any);
    }

    const geofenceLayerIds = ["geofences-fill", "geofences-line", "geofences-hitbox", "geofences-title"] as const;
    const existingGeofenceLayers = () => geofenceLayerIds.filter((layerId) => Boolean(m.getLayer?.(layerId)));

    const ensureLayers = () => {
      if (!m.isStyleLoaded?.()) return;

      if (!m.getLayer("geofences-fill")) {
        m.addLayer({
          source: id,
          id: "geofences-fill",
          type: "fill",
          filter: ["all", ["==", "$type", "Polygon"]],
          paint: {
            "fill-color": ["get", "color"],
            "fill-outline-color": ["get", "color"],
            "fill-opacity": 0.1,
          },
        } as any);
      }
      if (!m.getLayer("geofences-line")) {
        m.addLayer({
          source: id,
          id: "geofences-line",
          type: "line",
          paint: {
            "line-color": ["get", "color"],
            "line-width": ["get", "width"],
            "line-opacity": ["get", "opacity"],
          },
        } as any);
      }
      if (!m.getLayer("geofences-hitbox")) {
        m.addLayer({
          source: id,
          id: "geofences-hitbox",
          type: "line",
          filter: ["all", ["==", "$type", "LineString"]],
          paint: {
            "line-color": ["get", "color"],
            "line-width": 14,
            "line-opacity": 0,
          },
        } as any);
      }
      if (!m.getLayer("geofences-title")) {
        m.addLayer({
          source: id,
          id: "geofences-title",
          type: "symbol",
          layout: {
            "text-field": "{name}",
            "text-font": findFonts(m),
            "text-size": 12,
          },
          paint: { "text-halo-color": "white", "text-halo-width": 1 },
        } as any);
      }
    };

    const handleClick = (e: any) => {
      const f = e?.features?.[0];
      const rawId = f?.id ?? f?.properties?.id;
      if (rawId == null) return;
      const parsed = Number(rawId);
      const nextId = Number.isNaN(parsed) ? rawId : parsed;
      clickOnGeofenceRef.current = true;
      onGeofenceSelected?.(nextId);
    };

    const handleMapBackgroundClick = (e: any) => {
      if (!onGeofenceSelected) return;
      const layers = existingGeofenceLayers();
      const features =
        layers.length > 0
          ? (() => {
              try {
                return m.queryRenderedFeatures(e.point, { layers });
              } catch {
                return [];
              }
            })()
          : [];
      if (clickOnGeofenceRef.current) {
        clickOnGeofenceRef.current = false;
        return;
      }
      if (!features || features.length === 0) {
        onGeofenceSelected(null);
      }
    };

    const handleMouseEnter = () => {
      m.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      m.getCanvas().style.cursor = "";
    };

    const onStyle = () => ensureLayers();
    m.on("styledata", onStyle);
    ensureLayers();

    const bindLayerEvents = () => {
      const layers = existingGeofenceLayers();
      layers.forEach((layerId) => {
        m.on("click", layerId, handleClick);
        m.on("mouseenter", layerId, handleMouseEnter);
        m.on("mouseleave", layerId, handleMouseLeave);
      });
    };
    const unbindLayerEvents = () => {
      geofenceLayerIds.forEach((layerId) => {
        try {
          m.off("click", layerId, handleClick);
          m.off("mouseenter", layerId, handleMouseEnter);
          m.off("mouseleave", layerId, handleMouseLeave);
        } catch {}
      });
    };

    const onStyleWithEvents = () => {
      ensureLayers();
      unbindLayerEvents();
      bindLayerEvents();
    };

    m.off("styledata", onStyle);
    m.on("styledata", onStyleWithEvents);
    bindLayerEvents();
    m.on("click", handleMapBackgroundClick);

    return () => {
      m.off("styledata", onStyleWithEvents);
      unbindLayerEvents();
      m.off("click", handleMapBackgroundClick);
      try {
        if (m.getLayer("geofences-fill")) m.removeLayer("geofences-fill");
        if (m.getLayer("geofences-line")) m.removeLayer("geofences-line");
        if (m.getLayer("geofences-hitbox")) m.removeLayer("geofences-hitbox");
        if (m.getLayer("geofences-title")) m.removeLayer("geofences-title");
        if (m.getSource(id)) m.removeSource(id);
      } catch {}
    };
  }, [id, map, mapReady, onGeofenceSelected]);

  useEffect(() => {
    if (!mapReady || !map) return;
    const m: any = map;
    const src: any = m.getSource?.(id);
    if (!src || typeof src.setData !== "function") return;

    const features = Object.values(geofences)
      .filter((g) => !(g as any)?.attributes?.hide)
      .filter((g) => typeof g.area === "string" && g.area.length > 0)
      .map((g) => geofenceToFeature(themeShim, g));
    src.setData({ type: "FeatureCollection", features } as any);
  }, [geofences, id, map, mapReady, themeShim]);

  return null;
}

MapGeofence.handlesMapReady = true;

