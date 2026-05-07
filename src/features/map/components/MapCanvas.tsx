import "maplibre-gl/dist/maplibre-gl.css";

import maplibregl, { type Map as MapLibreMap, type Marker } from "maplibre-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DeviceLite, PositionLite } from "../types";

const DEFAULT_STYLE = "https://demotiles.maplibre.org/style.json";

export function MapCanvas({
  positions,
  devicesById,
  onSelectDevice,
}: Readonly<{
  positions: PositionLite[];
  devicesById: Record<number, DeviceLite>;
  onSelectDevice?: (deviceId: number) => void;
}>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<number, Marker>>(new Map());
  const [mapError, setMapError] = useState<string | null>(null);

  const hasPositions = positions.length > 0;

  const bounds = useMemo(() => {
    if (!hasPositions) return null;
    const b = new maplibregl.LngLatBounds();
    positions.forEach((p) => b.extend([p.longitude, p.latitude]));
    return b;
  }, [hasPositions, positions]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DEFAULT_STYLE,
      center: [-74.08175, 4.60971], // Bogotá
      zoom: 5,
      attributionControl: false,
    });

    const onError = (e: any) => {
      const message = e?.error?.message || e?.message || "Map error";
      setMapError(String(message));
    };
    map.on("error", onError);

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.off("error", onError);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Create/update markers
    positions.forEach((p) => {
      const id = p.deviceId;
      const existing = markersRef.current.get(id);
      const title = devicesById[id]?.name ?? `#${id}`;

      if (existing) {
        existing.setLngLat([p.longitude, p.latitude]);
        return;
      }

      const el = document.createElement("button");
      el.type = "button";
      el.title = title;
      el.className =
        "w-3 h-3 rounded-full bg-[--color-primary] shadow ring-2 ring-white";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        onSelectDevice?.(id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);

      markersRef.current.set(id, marker);
    });

    // Remove markers that disappeared
    const currentIds = new Set(positions.map((p) => p.deviceId));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [devicesById, onSelectDevice, positions]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !bounds) return;
    if (!map.isStyleLoaded()) {
      const onLoad = () => {
        map.fitBounds(bounds, { padding: 40, duration: 0 });
      };
      map.once("load", onLoad);
      return () => {
        map.off("load", onLoad);
      };
    }
    map.fitBounds(bounds, { padding: 40, duration: 0 });
  }, [bounds]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {mapError && (
        <div className="pointer-events-none absolute left-3 top-3 max-w-[min(520px,calc(100%-24px))] rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs text-red-200">
          No se pudo cargar el mapa: {mapError}
        </div>
      )}
    </div>
  );
}

