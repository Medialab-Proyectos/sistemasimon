import { useEffect, useId, useMemo } from "react";
import { useMapRuntime } from "../MapRuntime";

type PositionLite = {
  deviceId: string | number;
  latitude: number;
  longitude: number;
  attributes?: Record<string, unknown> | null;
};

export function MapAccuracy({ positions }: Readonly<{ positions: PositionLite[] }>) {
  const id = useId();
  const { map, mapReady } = useMapRuntime();

  const data = useMemo(() => {
    const features = (positions ?? [])
      .map((p) => {
        const accuracy = Number((p.attributes as any)?.accuracy ?? (p.attributes as any)?.hdop ?? 0);
        if (!Number.isFinite(accuracy) || accuracy <= 0) return null;
        return {
          type: "Feature",
          id: `${p.deviceId}`,
          geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
          properties: { accuracy },
        };
      })
      .filter(Boolean);
    return { type: "FeatureCollection", features } as any;
  }, [positions]);

  useEffect(() => {
    const m: any = map;
    if (!mapReady || !m) return;

    const sourceId = `${id}-accuracy`;
    const layerId = `${id}-accuracy-circle`;

    const ensure = () => {
      if (!m.isStyleLoaded()) return;
      if (!m.getSource(sourceId)) {
        m.addSource(sourceId, { type: "geojson", data } as any);
      }
      if (!m.getLayer(layerId)) {
        m.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2, 18, 10],
            "circle-color": "rgba(0, 241, 199, 0.15)",
            "circle-stroke-color": "rgba(0, 241, 199, 0.35)",
            "circle-stroke-width": 1,
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
    const sourceId = `${id}-accuracy`;
    const src = m.getSource(sourceId);
    if (src && typeof src.setData === "function") src.setData(data);
  }, [data, id, map, mapReady]);

  return null;
}

MapAccuracy.handlesMapReady = true;

