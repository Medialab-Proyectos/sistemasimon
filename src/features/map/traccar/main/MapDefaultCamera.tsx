import maplibregl from "maplibre-gl";
import { useEffect, useMemo, useState } from "react";
import { useMapRuntime } from "../MapRuntime";

type PositionLite = { latitude: number; longitude: number; deviceId: string | number };

export function MapDefaultCamera({
  selectedDeviceId,
  positions,
}: Readonly<{
  selectedDeviceId: number | null;
  positions: PositionLite[];
}>) {
  const { map, mapReady } = useMapRuntime();
  const [initialized, setInitialized] = useState(false);

  const coordinates = useMemo(() => {
    return (positions ?? [])
      .filter((p) => Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude)))
      .filter((p) => p.latitude >= -90 && p.latitude <= 90 && p.longitude >= -180 && p.longitude <= 180) // Valid range
      .filter((p) => p.latitude >= -10 && p.latitude <= 15 && p.longitude >= -85 && p.longitude <= -65) // Colombia bounding box
      .map((p) => [Number(p.longitude), Number(p.latitude)] as [number, number]);
  }, [positions]);

  useEffect(() => {
    if (!mapReady || !map) return;
    if (initialized) return;

    // If user has selected device, MapSelectedDevice handles centering.
    if (selectedDeviceId != null) return;

    if (coordinates.length > 1 && coordinates.length <= 100) {
      const bounds = coordinates.reduce(
        (b, item) => b.extend(item),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[1]),
      );
      const canvas = map.getCanvas();
      map.fitBounds(bounds, {
        duration: 0,
        padding: Math.min(canvas.width, canvas.height) * 0.1,
        maxZoom: 10,
      });
      setInitialized(true);
      return;
    }

    // If too many positions or none, center on Colombia
    map.jumpTo({
      center: [-74, 4],
      zoom: 5,
    });
    setInitialized(true);

    if (coordinates.length === 1) {
      map.jumpTo({
        center: coordinates[0],
        zoom: Math.max(map.getZoom(), 5),
      });
      setInitialized(true);
    }
  }, [coordinates, initialized, map, mapReady, selectedDeviceId]);

  return null;
}

MapDefaultCamera.handlesMapReady = true;

