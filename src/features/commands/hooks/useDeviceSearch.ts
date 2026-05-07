import { useCallback, useState } from "react";
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

export function useDeviceSearch() {
  const { api } = useScada();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string): Promise<VehicleInfo | null> => {
      if (!query.trim()) return null;
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<DeviceRow[]>("/api/devices?all=true");
        const devices = Array.isArray(data) ? data : [];
        const q = query.toLowerCase().trim();

        const found = devices.find((d) => {
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
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error buscando dispositivo");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  return { search, loading, error };
}