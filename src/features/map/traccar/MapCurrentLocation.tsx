import { useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMapRuntime } from "./MapRuntime";

export function MapCurrentLocation() {
  const { map } = useMapRuntime();
  const [error, setError] = useState<string | null>(null);
  const [lastControlError, setLastControlError] = useState<{ code?: number; message?: string } | null>(
    null,
  );

  const control = useMemo(() => {
    return new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: false, timeout: 10000 },
      trackUserLocation: true,
      showUserLocation: true,
    });
  }, []);

  useEffect(() => {
    if (!map) return;

    const onControlError = (e: any) => {
      const code = typeof e?.code === "number" ? e.code : undefined;
      const message = typeof e?.message === "string" ? e.message : undefined;
      setLastControlError({ code, message });
    };
    (control as any).on?.("error", onControlError);

    map.addControl(control as any, "top-right");

    return () => {
      try {
        (control as any).off?.("error", onControlError);
      } catch {}
      try {
        map.removeControl(control as any);
      } catch {}
    };
  }, [control, map]);

  useEffect(() => {
    if (!lastControlError) return;
    const code = lastControlError.code;
    if (code === 2 || code === 3) {
      setError(
        code === 3
          ? "Se agotó el tiempo para obtener tu ubicación"
          : "No se pudo obtener tu ubicación. Verificá tener WiFi encendido y tener los permisos necesarios.",
      );
    } else if (lastControlError.message) {
      setError(lastControlError.message);
    }
  }, [lastControlError]);

  return (
    error ? (
      <div className="pointer-events-none absolute left-3 top-3 right-3 z-20 max-w-[520px] rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs text-red-200">
        {error}
      </div>
    ) : null
  );
}

