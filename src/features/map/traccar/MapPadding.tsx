import { useEffect } from "react";
import { useMapRuntime } from "./MapRuntime";

export function MapPadding({ start }: Readonly<{ start: number }>) {
  const { map, mapReady } = useMapRuntime();

  useEffect(() => {
    if (!mapReady || !map) return;
    const padding = { top: 0, bottom: 0, left: start, right: 0 };
    try {
      (map as any).setPadding?.(padding);
    } catch {}
    return () => {
      try {
        (map as any).setPadding?.({ top: 0, bottom: 0, left: 0, right: 0 });
      } catch {}
    };
  }, [map, mapReady, start]);

  return null;
}

MapPadding.handlesMapReady = true;

