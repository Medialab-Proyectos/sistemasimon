import { useEffect, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { PositionLite } from "../types";

function normalizePositions(payload: unknown): PositionLite[] {
  if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
    return (payload as any).data as PositionLite[];
  }
  if (Array.isArray(payload)) {
    return payload as PositionLite[];
  }
  // Traccar a veces maneja posiciones como diccionario { [deviceId]: position }
  if (payload && typeof payload === "object") {
    const values = Object.values(payload as Record<string, unknown>);
    if (values.every((v) => v && typeof v === "object")) {
      return values as PositionLite[];
    }
  }
  return [];
}

export function usePositionsSnapshot({
  pollMs = 5000,
}: Readonly<{ pollMs?: number }>) {
  const { api } = useScada();
  const [items, setItems] = useState<PositionLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<unknown>("/api/v2/positions");
        if (cancelled) return;
        setItems(normalizePositions(data));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (cancelled) return;
        setLoading(false);
        timer = globalThis.setTimeout(run, pollMs);
      }
    };

    run();
    return () => {
      cancelled = true;
      if (timer != null) {
        globalThis.clearTimeout(timer);
      }
    };
  }, [api, pollMs]);

  return { items, loading, error };
}

