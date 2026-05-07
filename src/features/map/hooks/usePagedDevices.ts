import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { DeviceLite } from "../types";

const PAGE_SIZE = 10;

type DevicesV2Response = {
  data?: DeviceLite[];
  meta?: { totalPages?: number };
};

export function usePagedDevices(keyword: string) {
  const { api } = useScada();

  const [items, setItems] = useState<DeviceLite[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestInFlightRef = useRef(false);
  const requestSeqRef = useRef(0);
  const isMountedRef = useRef(true);
  const cacheRef = useRef<Map<string, { items: DeviceLite[]; page: number; hasMore: boolean }>>(
    new Map(),
  );

  const searchTerm = useMemo(() => keyword.trim(), [keyword]);

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (requestInFlightRef.current) return;
      const seq = ++requestSeqRef.current;
      requestInFlightRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const nameParam = searchTerm ? `&name=${encodeURIComponent(searchTerm)}` : "";
        const url = `/api/v2/devices?page=${pageToLoad}&pageSize=${PAGE_SIZE}${nameParam}`;
        const response = await api.get<DevicesV2Response>(url);
        const pageItems = Array.isArray(response?.data) ? response.data : [];
        const totalPages = Number(response?.meta?.totalPages ?? pageToLoad);

        if (!isMountedRef.current) return;
        // Ignore stale responses (keyword changed while request was in flight).
        if (seq !== requestSeqRef.current) return;
        setItems((prev) => (pageToLoad === 1 ? pageItems : [...prev, ...pageItems]));
        setPage(pageToLoad);
        setHasMore(pageToLoad < totalPages);
      } catch (e) {
        if (!isMountedRef.current) return;
        if (seq !== requestSeqRef.current) return;
        setError(e instanceof Error ? e.message : "Error al cargar dispositivos.");
      } finally {
        requestInFlightRef.current = false;
        if (!isMountedRef.current) return;
        if (seq !== requestSeqRef.current) return;
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [api, searchTerm],
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const cached = cacheRef.current.get(searchTerm);
    if (cached) {
      setItems(cached.items);
      setPage(cached.page);
      setHasMore(cached.hasMore);
      setInitialLoading(false);
      setLoading(false);
      setError(null);
      return;
    }
    setItems([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    // Bump request sequence so in-flight responses from prior terms are ignored.
    requestSeqRef.current += 1;
    void loadPage(1);
  }, [loadPage, searchTerm]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    void loadPage(page + 1);
  }, [hasMore, loadPage, loading, page]);

  useEffect(() => {
    cacheRef.current.set(searchTerm, { items, page, hasMore });
  }, [hasMore, items, page, searchTerm]);

  return { items, loading, initialLoading, error, hasMore, loadMore };
}

