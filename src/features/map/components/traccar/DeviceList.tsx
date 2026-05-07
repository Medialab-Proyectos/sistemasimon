import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { DeviceRow } from "./DeviceRow";
import { usePagedDevices } from "../../hooks/usePagedDevices";

export function DeviceList({
  keyword,
  selectedDeviceId,
  onSelectDevice,
}: Readonly<{
  keyword: string;
  selectedDeviceId: number | null;
  onSelectDevice: (deviceId: number) => void;
}>) {
  const { items, initialLoading, loading, error, hasMore, loadMore } = usePagedDevices(keyword);

  const listRef = useRef<HTMLDivElement | null>(null);

  const onNearBottom = useCallback(() => {
    if (!hasMore || loading) return;
    loadMore();
  }, [hasMore, loadMore, loading]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 400;
      if (isNearBottom) onNearBottom();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [onNearBottom]);

  const rows = useMemo(() => items, [items]);

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!loading && rows.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Sin dispositivos aún
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={listRef}
      className="scada-scrollbar"
      sx={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 1.5,
        height: "100%",
      }}
    >
      {rows.map((d) => (
        <DeviceRow
          key={String(d.id)}
          device={d}
          selected={selectedDeviceId === Number(d.id)}
          onSelect={() => onSelectDevice(Number(d.id))}
        />
      ))}
      {loading && hasMore ? (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
          <CircularProgress size={40} />
        </Box>
      ) : null}
    </Box>
  );
}

