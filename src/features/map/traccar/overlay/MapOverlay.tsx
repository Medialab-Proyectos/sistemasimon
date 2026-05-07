import { useId, useEffect } from "react";
import { useMapRuntime } from "../MapRuntime";
import useMapOverlays from "./useMapOverlays";

export function MapOverlay() {
  const id = useId();
  const { map, mapReady } = useMapRuntime();

  const mapOverlays = useMapOverlays();
  const activeOverlay = mapOverlays.filter((o) => o.available)[0] ?? null;

  useEffect(() => {
    if (!mapReady || !map) return;
    if (!activeOverlay) return;
    try {
      const m: any = map;
      if (typeof m?.isStyleLoaded === "function" && !m.isStyleLoaded()) {
        return;
      }
      map.addSource(id, activeOverlay.source);
      map.addLayer({
        id,
        type: "raster",
        source: id,
        layout: { visibility: "visible" },
      } as any);
    } catch {}
    return () => {
      try {
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
      } catch {}
    };
  }, [activeOverlay, id, map, mapReady]);

  return null;
}

MapOverlay.handlesMapReady = true;

