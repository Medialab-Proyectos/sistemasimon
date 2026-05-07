import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useMapRuntime } from "./MapRuntime";
import type { DeviceLite, PositionLite } from "../types";
import { findFonts } from "./mapUtil";
import { mapIconKey } from "./preloadImages";
import { usePref } from "../../../app/remote/usePref";

const LABEL_ZOOM_THRESHOLD = 13;
const ICON_SCALE_FALLBACK = 0.75;
const LABEL_OFFSET_SCALE = ICON_SCALE_FALLBACK;

type Props = {
  positions: PositionLite[];
  devicesById: Record<string, DeviceLite>;
  selectedDeviceId: number | null;
  onSelectDevice?: (deviceId: number) => void;
};

function normalizeStatus(status: unknown) {
  if (typeof status !== "string") return "unknown";
  const s = status.toLowerCase();
  if (s === "online" || s === "offline" || s === "unknown") return s;
  return "unknown";
}

function statusColor(status: string) {
  switch (status) {
    case "online":
      return "success";
    case "offline":
      return "error";
    default:
      return "neutral";
  }
}

function normalizeMarkerColor(color: unknown): "info" | "success" | "error" | "neutral" | null {
  if (typeof color !== "string") return null;
  const c = color.toLowerCase();
  if (c === "info" || c === "success" || c === "error" || c === "neutral") return c;
  return null;
}

function buildFeature(
  positions: PositionLite[],
  devicesById: Record<string, DeviceLite>,
  selectedDeviceId: number | null,
  frozenGeometry: Map<string, { longitude: number; latitude: number }> | null,
  freezeGeometry: boolean,
) {
  return positions
    .map((p) => {
    const rawLatitude = Number((p as any).latitude);
    const rawLongitude = Number((p as any).longitude);
    const key = String(p.deviceId);
    const frozen = freezeGeometry ? frozenGeometry?.get(key) : undefined;
    const latitude = frozen ? frozen.latitude : rawLatitude;
    const longitude = frozen ? frozen.longitude : rawLongitude;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    const d = devicesById[String(p.deviceId)];
    const label =
      (typeof d?.attributes?.plate === "string" ? d.attributes.plate : "") ||
      d?.name ||
      d?.uniqueId ||
      `#${p.deviceId}`;

    const normalized = normalizeStatus(d?.status);
    const numericDeviceId = Number(p.deviceId);
    const isSelected =
      selectedDeviceId != null &&
      Number.isFinite(numericDeviceId) &&
      numericDeviceId === selectedDeviceId;

    const hasMotion = Boolean((p.attributes as any)?.motion);
    const hasSpeed = Number(p.speed || 0) > 0.5;
    const attrColor = normalizeMarkerColor((p.attributes as any)?.color);

    let base: "info" | "success" | "error" | "neutral" = statusColor(normalized);
    if (normalized === "offline" || normalized === "unknown") {
      base = statusColor(normalized);
    } else if (hasMotion || hasSpeed) {
      base = "success";
    } else if (attrColor != null) {
      base = attrColor;
    }

    const color: "info" | "success" | "error" | "neutral" = isSelected ? "info" : base;

    return {
      type: "Feature",
      id: p.id ?? `${p.deviceId}`,
      geometry: { type: "Point", coordinates: [longitude, latitude] },
      properties: {
        id: p.id ?? null,
        deviceId: Number.isFinite(numericDeviceId) ? numericDeviceId : p.deviceId,
        label,
        category: mapIconKey(d?.category),
        color,
        rotation: typeof p.course === "number" ? p.course : 0,
        direction: isSelected && typeof p.course === "number" && p.course > 0,
      },
    } as const;
  })
    .filter((f): f is NonNullable<typeof f> => f != null);
}

export function MapPositions({
  positions,
  devicesById,
  selectedDeviceId,
  onSelectDevice,
}: Readonly<Props>) {
  const { map, mapReady } = useMapRuntime();
  const iconScale = usePref<number>("iconScale", ICON_SCALE_FALLBACK) ?? ICON_SCALE_FALLBACK;
  const mapCluster = usePref<boolean>("mapCluster", true) ?? true;
  const viewportFilterEnabled = usePref<boolean>("web.viewportFilter", true) ?? true;
  const maxPositionsRender = usePref<number>("web.maxPositionsRender", 5000) ?? 5000;
  const viewportDebounceMs = usePref<number>("web.viewportDebounceMs", 200) ?? 200;
  const lowZoomThreshold = usePref<number>("web.lowZoomThreshold", 10) ?? 10;
  const lowZoomUpdateMs = usePref<number>("web.lowZoomUpdateMs", 4000) ?? 4000;
  const nearUpdateMs = usePref<number>("web.nearUpdateMs", 150) ?? 150;
  const id = useId();
  const sourceId = useMemo(() => `${id}-positions`, [id]);
  const selectedSourceId = useMemo(() => `${id}-selected`, [id]);
  const clustersLayerId = useMemo(() => `${id}-clusters`, [id]);
  const pointsLayerId = useMemo(() => `${id}-points`, [id]);
  const directionLayerId = useMemo(() => `${id}-direction`, [id]);
  const selectedPointsLayerId = useMemo(() => `${id}-selected-points`, [id]);
  const selectedDirectionLayerId = useMemo(() => `${id}-selected-direction`, [id]);

  const installedRef = useRef(false);
  const handlersInstalledRef = useRef(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const lastSetDataAtRef = useRef(0);
  const pendingTimerRef = useRef<number | null>(null);
  const pendingUpdateRef = useRef(false);
  const [viewportPositions, setViewportPositions] = useState<PositionLite[] | null>(null);
  const viewportTimerRef = useRef<number | null>(null);
  const frozenGeometryRef = useRef<Map<string, { longitude: number; latitude: number }>>(new Map());
  const loadingShowTimerRef = useRef<number | null>(null);
  const loadingHideTimerRef = useRef<number | null>(null);
  const loadingShownAtRef = useRef<number | null>(null);
  const allDataRef = useRef<{ rest: unknown; selected: unknown } | null>(null);
  const iconScaleRef = useRef<number>(iconScale);

  const LOADING_SHOW_DELAY_MS = 120;
  const LOADING_MIN_VISIBLE_MS = 250;

  const effectivePositions = useMemo(() => {
    return viewportPositions ?? positions;
  }, [positions, viewportPositions]);

  useEffect(() => {
    const m = map as any;
    if (!mapReady || !m || typeof m.getZoom !== "function") return;
    if (m.getZoom() >= lowZoomThreshold) {
      frozenGeometryRef.current.clear();
      effectivePositions.forEach((p) => {
        const longitude = Number((p as any).longitude);
        const latitude = Number((p as any).latitude);
        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return;
        frozenGeometryRef.current.set(String(p.deviceId), { longitude, latitude });
      });
    } else {
      effectivePositions.forEach((p) => {
        const key = String(p.deviceId);
        if (frozenGeometryRef.current.has(key)) return;
        const longitude = Number((p as any).longitude);
        const latitude = Number((p as any).latitude);
        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return;
        frozenGeometryRef.current.set(key, { longitude, latitude });
      });
    }
  }, [effectivePositions, lowZoomThreshold, map, mapReady]);

  const computeViewportPositions = useCallback(() => {
    const m = map as any;
    if (!mapReady || !m || typeof m.getBounds !== "function") return;
    if (!viewportFilterEnabled) {
      if (viewportPositions !== null) setViewportPositions(null);
      return;
    }
    if (!Array.isArray(positions) || positions.length <= maxPositionsRender) {
      if (viewportPositions !== null) setViewportPositions(null);
      return;
    }

    const b = m.getBounds?.();
    if (!b) return;
    const north = Number(b.getNorth?.());
    const south = Number(b.getSouth?.());
    const east = Number(b.getEast?.());
    const west = Number(b.getWest?.());
    if (![north, south, east, west].every(Number.isFinite)) return;

    const latPad = Math.max(0.05, Math.abs(north - south) * 0.15);
    const lngPad = Math.max(0.05, Math.abs(east - west) * 0.15);
    const n = Math.min(90, north + latPad);
    const s = Math.max(-90, south - latPad);
    const e = Math.min(180, east + lngPad);
    const w = Math.max(-180, west - lngPad);

    const inLng = (lng: number) => {
      if (w <= e) return lng >= w && lng <= e;
      return lng >= w || lng <= e;
    };

    const filtered = positions.filter((p) => {
      const lat = Number((p as any).latitude);
      const lng = Number((p as any).longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
      if (lat < s || lat > n) return false;
      return inLng(lng);
    });

    setViewportPositions(filtered);
  }, [map, mapReady, maxPositionsRender, positions, viewportFilterEnabled, viewportPositions]);

  const allData = useMemo(() => {
    const m = map as any;
    const zoom = mapReady && m && typeof m.getZoom === "function" ? m.getZoom() : 99;
    const freezeGeometry = zoom < lowZoomThreshold;
    const features = buildFeature(
      effectivePositions,
      devicesById,
      selectedDeviceId,
      frozenGeometryRef.current,
      freezeGeometry,
    );
    const selected =
      selectedDeviceId == null
        ? []
        : features.filter((f) => f.properties.deviceId === selectedDeviceId);
    const rest =
      selectedDeviceId == null
        ? features
        : features.filter((f) => f.properties.deviceId !== selectedDeviceId);
    return {
      rest: { type: "FeatureCollection", features: rest },
      selected: { type: "FeatureCollection", features: selected },
    } as const;
  }, [devicesById, effectivePositions, lowZoomThreshold, map, mapReady, selectedDeviceId]);

  useEffect(() => {
    allDataRef.current = allData as unknown as { rest: unknown; selected: unknown };
  }, [allData]);

  useEffect(() => {
    iconScaleRef.current = iconScale;
  }, [iconScale]);

  useEffect(() => {
    const m = map as any;
    if (!mapReady || !m) return;

    const schedule = () => {
      if (viewportTimerRef.current != null) {
        clearTimeout(viewportTimerRef.current);
      }
      viewportTimerRef.current = globalThis.setTimeout(() => {
        viewportTimerRef.current = null;
        computeViewportPositions();
      }, Math.max(0, viewportDebounceMs));
    };

    schedule();

    m.on("moveend", schedule);
    m.on("zoomend", schedule);
    return () => {
      m.off("moveend", schedule);
      m.off("zoomend", schedule);
      if (viewportTimerRef.current != null) {
        clearTimeout(viewportTimerRef.current);
        viewportTimerRef.current = null;
      }
    };
  }, [computeViewportPositions, map, mapReady, viewportDebounceMs]);

  useEffect(() => {
    const m = map as any;
    if (!mapReady) return;
    if (!m || typeof m.getSource !== "function") return;
    installedRef.current = true;

    const onMouseEnter = () => {
      m.getCanvas().style.cursor = "pointer";
    };
    const onMouseLeave = () => {
      m.getCanvas().style.cursor = "";
    };

    const ensure = () => {
      if (!m.isStyleLoaded()) {
        setTimeout(ensure, 33);
        return;
      }

      if (!m.getSource(sourceId)) {
        const initial =
          allDataRef.current ?? {
            rest: { type: "FeatureCollection", features: [] },
            selected: { type: "FeatureCollection", features: [] },
          };
        m.addSource(sourceId, {
          type: "geojson",
          data: (initial as any).rest,
          cluster: mapCluster,
          clusterRadius: 50,
          clusterMaxZoom: 14,
        } as any);
      }
      if (!m.getSource(selectedSourceId)) {
        const initial =
          allDataRef.current ?? {
            rest: { type: "FeatureCollection", features: [] },
            selected: { type: "FeatureCollection", features: [] },
          };
        m.addSource(selectedSourceId, {
          type: "geojson",
          data: (initial as any).selected,
        } as any);
      }

      if (!m.getLayer(clustersLayerId)) {
        m.addLayer({
          id: clustersLayerId,
          type: "symbol",
          source: sourceId,
          filter: ["has", "point_count"],
          layout: {
            "icon-image": "background",
            "icon-size": iconScaleRef.current,
            "text-field": "{point_count_abbreviated}",
            "text-font": findFonts(m),
            "text-size": 14,
          },
        } as any);
      }

      const fadeStart = Math.max(0, lowZoomThreshold - 1);
      const lowZoomFade = [
        "interpolate",
        ["linear"],
        ["zoom"],
        fadeStart,
        0,
        lowZoomThreshold,
        1,
      ];

      if (!m.getLayer(pointsLayerId)) {
        m.addLayer({
          id: pointsLayerId,
          type: "symbol",
          source: sourceId,
          filter: ["!has", "point_count"],
          layout: {
            "icon-image": "{category}-{color}",
            "icon-allow-overlap": true,
            "icon-size": iconScaleRef.current,
            "icon-rotate": ["get", "rotation"],
            "text-field": [
              "step",
              ["zoom"],
              "",
              LABEL_ZOOM_THRESHOLD,
              ["coalesce", ["get", "label"], ""],
            ],
            "text-allow-overlap": true,
            "text-anchor": "bottom",
            "text-offset": [0, -2 * LABEL_OFFSET_SCALE],
            "text-font": findFonts(m),
            "text-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              LABEL_ZOOM_THRESHOLD,
              11,
              18,
              14,
            ],
          },
          paint: {
            "text-halo-color": "white",
            "text-halo-width": 2,
            "icon-opacity": lowZoomFade as any,
            "text-opacity": lowZoomFade as any,
          },
        } as any);
      }
      if (!m.getLayer(directionLayerId)) {
        m.addLayer({
          id: directionLayerId,
          type: "symbol",
          source: sourceId,
          filter: ["all", ["!has", "point_count"], ["==", "direction", true]],
          layout: {
            "icon-image": "direction",
            "icon-size": iconScaleRef.current,
            "icon-allow-overlap": true,
            "icon-rotate": ["get", "rotation"],
            "icon-rotation-alignment": "map",
          },
          paint: {
            "icon-opacity": lowZoomFade as any,
          },
        } as any);
      }

      if (!m.getLayer(selectedPointsLayerId)) {
        m.addLayer({
          id: selectedPointsLayerId,
          type: "symbol",
          source: selectedSourceId,
          filter: ["!has", "point_count"],
          layout: {
            "icon-image": "{category}-{color}",
            "icon-allow-overlap": true,
            "icon-size": iconScaleRef.current * 1.12,
            "icon-rotate": ["get", "rotation"],
            "text-field": [
              "step",
              ["zoom"],
              "",
              LABEL_ZOOM_THRESHOLD,
              ["coalesce", ["get", "label"], ""],
            ],
            "text-allow-overlap": true,
            "text-anchor": "bottom",
            "text-offset": [0, -2 * LABEL_OFFSET_SCALE],
            "text-font": findFonts(m),
            "text-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              LABEL_ZOOM_THRESHOLD,
              12,
              18,
              16,
            ],
          },
          paint: {
            "text-halo-color": "white",
            "text-halo-width": 2,
          },
        } as any);
      }
      if (!m.getLayer(selectedDirectionLayerId)) {
        m.addLayer({
          id: selectedDirectionLayerId,
          type: "symbol",
          source: selectedSourceId,
          filter: ["all", ["!has", "point_count"], ["==", "direction", true]],
          layout: {
            "icon-image": "direction",
            "icon-size": iconScaleRef.current * 1.08,
            "icon-allow-overlap": true,
            "icon-rotate": ["get", "rotation"],
            "icon-rotation-alignment": "map",
          },
        } as any);
      }

      if (!handlersInstalledRef.current) {
        handlersInstalledRef.current = true;

        m.on("mouseenter", pointsLayerId, onMouseEnter);
        m.on("mouseleave", pointsLayerId, onMouseLeave);
        m.on("mouseenter", selectedPointsLayerId, onMouseEnter);
        m.on("mouseleave", selectedPointsLayerId, onMouseLeave);
        m.on("mouseenter", clustersLayerId, onMouseEnter);
        m.on("mouseleave", clustersLayerId, onMouseLeave);

        m.on("click", pointsLayerId, (event: any) => {
          const feature = event?.features?.[0];
          const deviceId = feature?.properties?.deviceId;
          if (typeof deviceId === "number") onSelectDevice?.(deviceId);
          if (typeof deviceId === "string" && /^\d+$/.test(deviceId))
            onSelectDevice?.(Number(deviceId));
        });
        m.on("click", selectedPointsLayerId, (event: any) => {
          const feature = event?.features?.[0];
          const deviceId = feature?.properties?.deviceId;
          if (typeof deviceId === "number") onSelectDevice?.(deviceId);
          if (typeof deviceId === "string" && /^\d+$/.test(deviceId))
            onSelectDevice?.(Number(deviceId));
        });

        m.on("click", clustersLayerId, async (event: any) => {
          try {
            if (!m.getLayer(clustersLayerId)) return;
            const features = m.queryRenderedFeatures(event.point, { layers: [clustersLayerId] });
            const clusterId = features?.[0]?.properties?.cluster_id;
            const src: any = m.getSource(sourceId);
            if (!(src && typeof src.getClusterExpansionZoom === "function") || clusterId == null)
              return;
            const zoom = await src.getClusterExpansionZoom(clusterId);
            const geometry = features?.[0]?.geometry;
            const coords =
              geometry?.type === "Point"
                ? ((geometry as unknown as { coordinates?: unknown }).coordinates ?? null)
                : null;
            if (Array.isArray(coords) && coords.length === 2) {
              const center: [number, number] = [Number(coords[0]), Number(coords[1])];
              m.easeTo({ center, zoom });
            }
          } catch {
          }
        });
      }
    };

    const onStyle = () => ensure();
    m.on("styledata", onStyle);
    ensure();

    return () => {
      m.off("styledata", onStyle);
      if (handlersInstalledRef.current) {
        handlersInstalledRef.current = false;
        m.off("mouseenter", pointsLayerId, onMouseEnter);
        m.off("mouseleave", pointsLayerId, onMouseLeave);
        m.off("mouseenter", selectedPointsLayerId, onMouseEnter);
        m.off("mouseleave", selectedPointsLayerId, onMouseLeave);
        m.off("mouseenter", clustersLayerId, onMouseEnter);
        m.off("mouseleave", clustersLayerId, onMouseLeave);
      }
      try {
        if (m.getLayer(pointsLayerId)) m.removeLayer(pointsLayerId);
        if (m.getLayer(directionLayerId)) m.removeLayer(directionLayerId);
        if (m.getLayer(selectedPointsLayerId)) m.removeLayer(selectedPointsLayerId);
        if (m.getLayer(selectedDirectionLayerId)) m.removeLayer(selectedDirectionLayerId);
        if (m.getLayer(clustersLayerId)) m.removeLayer(clustersLayerId);
        if (m.getSource(sourceId)) m.removeSource(sourceId);
        if (m.getSource(selectedSourceId)) m.removeSource(selectedSourceId);
      } catch {
      }
    };
  }, [
    clustersLayerId,
    directionLayerId,
    mapReady,
    onSelectDevice,
    pointsLayerId,
    selectedDirectionLayerId,
    selectedPointsLayerId,
    selectedSourceId,
    sourceId,
    mapCluster,
  ]);

  useEffect(() => {
    const m = map as any;
    if (!mapReady || !m) return;
    const set = (layerId: string, value: number) => {
      try {
        if (m.getLayer?.(layerId)) m.setLayoutProperty?.(layerId, "icon-size", value);
      } catch {}
    };
    set(clustersLayerId, iconScale);
    set(pointsLayerId, iconScale);
    set(directionLayerId, iconScale);
    set(selectedPointsLayerId, iconScale * 1.12);
    set(selectedDirectionLayerId, iconScale * 1.08);
  }, [
    clustersLayerId,
    directionLayerId,
    iconScale,
    map,
    mapReady,
    pointsLayerId,
    selectedDirectionLayerId,
    selectedPointsLayerId,
  ]);

  useEffect(() => {
    const m = map as any;
    if (!mapReady) return;
    if (!m || typeof m.getSource !== "function") return;

    const setDataNow = () => {
      pendingUpdateRef.current = false;
      if (pendingTimerRef.current != null) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
      const src = m.getSource(sourceId);
      const sel = m.getSource(selectedSourceId);
      if (!src || typeof src.setData !== "function") return;
      if (!sel || typeof sel.setData !== "function") return;
      if (loadingShowTimerRef.current == null && !loadingVisible) {
        loadingShowTimerRef.current = globalThis.setTimeout(() => {
          loadingShowTimerRef.current = null;
          loadingShownAtRef.current = Date.now();
          setLoadingVisible(true);
        }, LOADING_SHOW_DELAY_MS);
      }
      try {
        src.setData(allData.rest as any);
        sel.setData(allData.selected as any);
        lastSetDataAtRef.current = Date.now();
      } finally {
        if (loadingShowTimerRef.current != null) {
          clearTimeout(loadingShowTimerRef.current);
          loadingShowTimerRef.current = null;
        }
        if (loadingHideTimerRef.current != null) {
          clearTimeout(loadingHideTimerRef.current);
          loadingHideTimerRef.current = null;
        }
        const shownAt = loadingShownAtRef.current;
        if (shownAt == null) {
          setLoadingVisible(false);
        } else {
          const elapsed = Date.now() - shownAt;
          const wait = Math.max(0, LOADING_MIN_VISIBLE_MS - elapsed);
          loadingHideTimerRef.current = globalThis.setTimeout(() => {
            loadingHideTimerRef.current = null;
            loadingShownAtRef.current = null;
            setLoadingVisible(false);
          }, wait);
        }
      }
    };

    const schedule = () => {
      const zoom = typeof m.getZoom === "function" ? m.getZoom() : 0;
      const now = Date.now();
      const minInterval = zoom < lowZoomThreshold ? lowZoomUpdateMs : nearUpdateMs;
      const elapsed = now - lastSetDataAtRef.current;
      if (elapsed >= minInterval) {
        setDataNow();
        return;
      }
      pendingUpdateRef.current = true;
      pendingTimerRef.current ??= globalThis.setTimeout(() => {
        pendingTimerRef.current = null;
        setDataNow();
      }, Math.max(0, minInterval - elapsed));
    };

    schedule();
    const onMoveEnd = () => schedule();
    const onZoomEnd = () => schedule();
    m.on("moveend", onMoveEnd);
    m.on("zoomend", onZoomEnd);

    return () => {
      m.off("moveend", onMoveEnd);
      m.off("zoomend", onZoomEnd);
      if (pendingTimerRef.current != null) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
      if (loadingShowTimerRef.current != null) {
        clearTimeout(loadingShowTimerRef.current);
        loadingShowTimerRef.current = null;
      }
      if (loadingHideTimerRef.current != null) {
        clearTimeout(loadingHideTimerRef.current);
        loadingHideTimerRef.current = null;
      }
    };
  }, [
    allData,
    iconScale,
    lowZoomThreshold,
    lowZoomUpdateMs,
    map,
    mapCluster,
    mapReady,
    nearUpdateMs,
    selectedSourceId,
    sourceId,
  ]);

  return loadingVisible ? (
    <div className="pointer-events-none absolute left-3 top-3 z-30 rounded-lg border border-border-subtle bg-surface/90 px-2 py-1 text-[10px] text-text shadow backdrop-blur">
      Cargando…
    </div>
  ) : null;
}

MapPositions.handlesMapReady = true;


