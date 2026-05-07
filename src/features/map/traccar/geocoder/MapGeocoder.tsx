import maplibregl from "maplibre-gl";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import { useEffect } from "react";
import { useMapRuntime } from "../MapRuntime";

export function MapGeocoder() {
  const { map } = useMapRuntime();

  useEffect(() => {
    if (!map) return;

    const geocoder = {
      forwardGeocode: async (config: any) => {
        const features: any[] = [];
        try {
          const request = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            config.query,
          )}&format=geojson&polygon_geojson=1&addressdetails=1`;
          const response = await fetch(request);
          const geojson = await response.json();
          geojson.features.forEach((feature: any) => {
            const center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];
            features.push({
              type: "Feature",
              geometry: { type: "Point", coordinates: center },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ["place"],
              center,
            });
          });
        } catch {
        }
        return { features };
      },
    };

    const control = new (MaplibreGeocoder as any)(geocoder, {
      maplibregl,
      collapsed: true,
    });

    map.addControl(control, "top-right");
    try {
      const container: HTMLElement | null =
        (control as { _container?: HTMLElement | null })?._container ??
        map.getContainer?.()?.querySelector?.(".maplibregl-ctrl-geocoder") ??
        null;
      if (container) {
        container.classList.add(
          "min-w-[240px]",
          "rounded-xl",
          "border",
          "border-[color:var(--color-border-subtle)]",
          "bg-[color:var(--color-surface)]/90",
          "text-[color:var(--color-text)]",
          "shadow",
          "backdrop-blur",
        );
        const input = container.querySelector("input");
        if (input) {
          input.classList.add(
            "bg-transparent",
            "text-sm",
            "placeholder:text-[color:var(--color-text-muted)]",
            "focus:outline-none",
          );
        }
      }
    } catch {}
    return () => {
      try {
        map.removeControl(control);
      } catch {}
    };
  }, [map]);

  return null;
}

MapGeocoder.handlesMapReady = true;

