import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { VehicleInfo } from "../components/VehicleInfoCard";

type DeviceRow = {
  id: number;
  name?: string | null;
  uniqueId?: string | null;
  attributes?: Record<string, unknown> | null;
};

function deviceToVehicle(d: DeviceRow): VehicleInfo {
  return {
    plate: (d.attributes?.plate as string) || d.name || d.uniqueId || `#${d.id}`,
    imei: d.uniqueId || "",
    iccid: (d.attributes?.iccid as string) || "",
    vehicleType: (d.attributes?.vehicleType as string) || "Desconocido",
    connected: true,
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout fetching devices")), ms),
    ),
  ]);
}

export function useDevicesForSearch() {
  const { api } = useScada();
  const [allDevices, setAllDevices] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const load = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await withTimeout(api.get<DeviceRow[]>("/api/devices?all=true"), 5000);
      setAllDevices(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando dispositivos");
      setAllDevices([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const byId = useMemo(() => {
    const map = new Map<number, DeviceRow>();
    allDevices.forEach((d) => map.set(Number(d.id), d));
    return map;
  }, [allDevices]);

  const findById = useCallback(
    (id: number): VehicleInfo | null => {
      const d = byId.get(id);
      return d ? deviceToVehicle(d) : null;
    },
    [byId],
  );

  const search = useCallback(
    (query: string): VehicleInfo | null => {
      if (!query.trim()) return null;
      const q = query.toLowerCase().trim();
      const found = allDevices.find((d) => {
        const plate = ((d.attributes?.plate as string) || d.name || "").toLowerCase();
        const imei = (d.uniqueId || "").toLowerCase();
        const iccid = ((d.attributes?.iccid as string) || "").toLowerCase();
        return (
          plate.includes(q) ||
          imei.includes(q) ||
          iccid.includes(q)
        );
      });
      return found ? deviceToVehicle(found) : null;
    },
    [allDevices],
  );

  return { search, findById, byId, loading, error };
}