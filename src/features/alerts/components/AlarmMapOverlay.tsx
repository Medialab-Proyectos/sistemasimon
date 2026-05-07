import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMapRuntime } from "../../map/traccar/MapRuntime";
import type { AlarmRow } from "../hooks/useOperationsAlarmsData";

export function AlarmMapOverlay({
  alarms,
  selectedId,
}: Readonly<{ alarms: AlarmRow[]; selectedId: string | null }>) {
  const { map, mapReady } = useMapRuntime();
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapReady || !map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const points = alarms
      .map((a) => ({
        ...a,
        lat: a.latitude,
        lng: a.longitude,
        selected: selectedId != null && a.id === selectedId,
      }))
      .filter((p) => typeof p.lat === "number" && typeof p.lng === "number") as Array<
      AlarmRow & { lat: number; lng: number; selected: boolean }
    >;

    points.forEach((p) => {
      const el = document.createElement("div");
      el.className = "rounded-full shadow ring-2 ring-white";
      el.style.width = p.selected ? "14px" : "10px";
      el.style.height = p.selected ? "14px" : "10px";
      el.style.background = p.selected ? "var(--color-error)" : "var(--color-primary)";
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .addTo(map as any);
      markersRef.current.push(marker);
    });

    // Fit viewport
    if (points.length) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 48, duration: 0 });
    }
  }, [alarms, map, mapReady, selectedId]);

  return null;
}

AlarmMapOverlay.handlesMapReady = true;

