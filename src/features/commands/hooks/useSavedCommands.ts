import { useCallback, useEffect, useMemo, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { SavedCommand } from "../types";

export function useSavedCommands() {
  const { api } = useScada();

  const [items, setItems] = useState<SavedCommand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((v) => v + 1), []);

  const removeById = useCallback(
    async (id: number) => {
      await api.delete<void>(`/api/commands/${id}`);
      setItems((prev) => prev.filter((it) => it.id !== id));
    },
    [api],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get<SavedCommand[]>("/api/commands")
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : []);
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
  }, [api, nonce]);

  const state = useMemo(
    () => ({ items, loading, error, refresh, removeById }),
    [items, loading, error, refresh, removeById],
  );

  return state;
}

