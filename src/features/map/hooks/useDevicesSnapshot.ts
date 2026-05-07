import { useEffect, useMemo, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { DeviceLite } from "../types";

export function useDevicesSnapshot() {
  const { api } = useScada();
  const [items, setItems] = useState<DeviceLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get<{ data: DeviceLite[] } | DeviceLite[]>("/api/v2/devices")
      .then((data) => {
        if (cancelled) return;
        const payload = data as { data?: DeviceLite[] } | DeviceLite[];
        if (Array.isArray(payload)) {
          setItems(payload);
          return;
        }
        setItems(Array.isArray(payload?.data) ? payload.data : []);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api]);

  const byId = useMemo(() => {
    const map: Record<number, DeviceLite> = {};
    items.forEach((d) => {
      map[d.id] = d;
    });
    return map;
  }, [items]);

  return { items, byId, loading, error };
}

