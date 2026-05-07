import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useMapRuntime } from "./MapRuntime";
import type { DeviceLite, PositionLite } from "../types";

function safe(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "";
}

export function MapSelectedDevicePopup({
  selectedDeviceId,
  selectedPosition,
  devicesById,
}: Readonly<{
  selectedDeviceId: number | null;
  selectedPosition: PositionLite | null;
  devicesById: Record<number, DeviceLite>;
}>) {
  const { map } = useMapRuntime();
  useEffect(() => {
    if (!map) return;
    if (selectedDeviceId == null || !selectedPosition) return;
    const d = devicesById[selectedDeviceId];
    if (!d) return;

    const existing = document.getElementsByClassName("maplibregl-popup");
    Array.from(existing).forEach((p) => p.remove());

    const plate = typeof d.attributes?.plate === "string" ? d.attributes?.plate : "";
    const title = plate || d.name || d.uniqueId || `#${selectedDeviceId}`;

    const fixTime = selectedPosition.fixTime ? new Date(selectedPosition.fixTime).toLocaleString() : "N/A";
    const html = `
      <div style="padding: 8px; min-width: 220px; color: #181818;">
        <div style="font-weight: 700; font-size: 13px;">${title}</div>
        <div style="font-size: 12px; color: #696969; margin-top: 4px;">${fixTime}</div>
        <div style="font-size: 12px; color: #696969; margin-top: 6px;">
          Lat: ${Number(selectedPosition.latitude).toFixed(6)}<br/>
          Lng: ${Number(selectedPosition.longitude).toFixed(6)}
        </div>
        <div style="font-size: 11px; color: #9e9e9e; margin-top: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
          ID: ${safe(selectedDeviceId)}
        </div>
      </div>
    `;

    const popup = new maplibregl.Popup({ offset: [0, -25], closeButton: true })
      .setLngLat([selectedPosition.longitude, selectedPosition.latitude])
      .setHTML(html)
      .addTo(map);

    return () => {
      try {
        popup.remove();
      } catch {}
    };
  }, [devicesById, selectedDeviceId, selectedPosition]);

  return null;
}

MapSelectedDevicePopup.handlesMapReady = true;

