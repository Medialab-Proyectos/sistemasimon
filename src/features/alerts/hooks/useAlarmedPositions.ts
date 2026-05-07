import { useEffect, useMemo, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { PositionLite } from "../../map/types";

function hasAlarm(attributes: Record<string, unknown> | null | undefined) {
  return Boolean(attributes && (attributes as any).alarm);
}

export function useAlarmedPositions() {
  const { api } = useScada();
  const [positions, setPositions] = useState<PositionLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get<PositionLite[]>("/api/positions")
      .then((data) => {
        if (cancelled) return;
        setPositions(Array.isArray(data) ? data : []);
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

  const alarmed = useMemo(() => positions.filter((p) => hasAlarm(p.attributes)), [positions]);

  return { positions, alarmed, loading, error };
}

