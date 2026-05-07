import { useEffect, useId, useMemo, useRef } from "react";
import { useScada } from "../../../../app/remote/ScadaProvider";
import { useMapRuntime } from "../MapRuntime";

type PositionLite = {
  deviceId: string | number;
  latitude: number;
  longitude: number;
  fixTime?: string | number | null;
};

export function MapLiveRoutes({
  deviceIds,
  positions,
}: Readonly<{ deviceIds: Array<string | number>; positions: PositionLite[] }>) {
  const id = useId();
  const { map, mapReady } = useMapRuntime();
  const { config } = useScada();

  const historyRef = useRef<Record<string, Array<[number, number]>>>({});

  useEffect(() => {
    // Accumulate basic history in-memory from incoming positions
    positions.forEach((p) => {
      const key = String(p.deviceId);
      const arr = (historyRef.current[key] ??= []);
      const last = arr[arr.length - 1];
      const next: [number, number] = [p.longitude, p.latitude];
      if (!last || last[0] !== next[0] || last[1] !== next[1]) {
        arr.push(next);
        if (arr.length > 200) arr.splice(0, arr.length - 200);
      }
    });
  }, [positions]);

  const lineColor = config.colorSecondary ?? config.colorPrimary ?? "#00F1C7";

  const data = useMemo(() => {
    const features = deviceIds
      .map((deviceId) => {
        const coords = historyRef.current[String(deviceId)] ?? [];
        if (coords.length < 2) return null;
        return {
          type: "Feature",
          geometry: { type: "LineString", coordinates: coords },
          properties: { color: lineColor, width: 2, opacity: 1 },
        };
      })
      .filter(Boolean);
    return { type: "FeatureCollection", features } as any;
  }, [deviceIds, lineColor]);

  useEffect(() => {
    const m: any = map;
    if (!mapReady || !m) return;

    const sourceId = `${id}-routes`;
    const layerId = `${id}-routes-line`;

    const ensure = () => {
      if (!m.isStyleLoaded()) return;
      if (!m.getSource(sourceId)) {
        m.addSource(sourceId, { type: "geojson", data } as any);
      }
      if (!m.getLayer(layerId)) {
        m.addLayer({
          source: sourceId,
          id: layerId,
          type: "line",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": ["get", "color"],
            "line-width": ["get", "width"],
            "line-opacity": ["get", "opacity"],
          },
        } as any);
      }
    };

    const onStyle = () => ensure();
    m.on("styledata", onStyle);
    ensure();

    return () => {
      m.off("styledata", onStyle);
      try {
        if (m.getLayer(layerId)) m.removeLayer(layerId);
        if (m.getSource(sourceId)) m.removeSource(sourceId);
      } catch {}
    };
  }, [data, id, map, mapReady]);

  useEffect(() => {
    const m: any = map;
    if (!mapReady || !m) return;
    const sourceId = `${id}-routes`;
    const src = m.getSource(sourceId);
    if (src && typeof src.setData === "function") src.setData(data);
  }, [data, id, map, mapReady]);

  return null;
}

MapLiveRoutes.handlesMapReady = true;

