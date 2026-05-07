import { useEffect } from "react";
import { useMapRuntime } from "../MapRuntime";

// SCADA: POI layer not wired yet; keep placeholder for parity.
export function PoiMap() {
  const { map, mapReady } = useMapRuntime();

  useEffect(() => {
    if (!mapReady || !map) return;
  }, [map, mapReady]);

  return null;
}

PoiMap.handlesMapReady = true;

