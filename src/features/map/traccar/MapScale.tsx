import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMapRuntime } from "./MapRuntime";

export function MapScale() {
  const { map } = useMapRuntime();
  const controlRef = useRef<maplibregl.ScaleControl | null>(null);

  useEffect(() => {
    if (!map) return;
    const control = new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" });
    controlRef.current = control;
    map.addControl(control, "bottom-left");
    return () => {
      try {
        map.removeControl(control);
      } catch {}
    };
  }, []);

  return null;
}

