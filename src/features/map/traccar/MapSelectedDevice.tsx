import { useEffect, useMemo, useRef } from "react";
import { useMapRuntime } from "./MapRuntime";
import type { PositionLite } from "../types";
import { usePref } from "../../../app/remote/usePref";

const DEFAULT_SELECT_ZOOM = 10;
const MIN_SELECT_ZOOM = 13;
const DEFAULT_POPUP_OFFSET_PX = 150;
const DEFAULT_POPUP_OFFSET_X_PX = 220; // half of ~420px card width

export function MapSelectedDevice({
  selectedDeviceId,
  selectedPosition,
  selectionTick,
}: Readonly<{
  selectedDeviceId: number | null;
  selectedPosition: PositionLite | null;
  selectionTick: number;
}>) {
  const { map, mapReady } = useMapRuntime();
  const lastCenteredFixTimeRef = useRef<string | null>(null);
  const lastLocateTickRef = useRef<number | null>(null);
  const userInteractingRef = useRef(false);

  useEffect(() => {
    if (!map) return;
    const onInteractionStart = () => {
      userInteractingRef.current = true;
    };
    const onInteractionEnd = () => {
      userInteractingRef.current = false;
    };
    map.on("movestart", onInteractionStart);
    map.on("zoomstart", onInteractionStart);
    map.on("moveend", onInteractionEnd);
    map.on("zoomend", onInteractionEnd);
    return () => {
      map.off("movestart", onInteractionStart);
      map.off("zoomstart", onInteractionStart);
      map.off("moveend", onInteractionEnd);
      map.off("zoomend", onInteractionEnd);
    };
  }, [map]);

  const selectZoom = usePref<number>("web.selectZoom", DEFAULT_SELECT_ZOOM) ?? DEFAULT_SELECT_ZOOM;
  const followSelected = usePref<boolean>("web.followSelectedDevice", true) ?? true;
  const popupOffsetPx =
    usePref<number>("web.popupMapOffsetPx", DEFAULT_POPUP_OFFSET_PX) ?? DEFAULT_POPUP_OFFSET_PX;
  const popupOffsetXPx =
    usePref<number>("web.popupMapOffsetXPx", DEFAULT_POPUP_OFFSET_X_PX) ?? DEFAULT_POPUP_OFFSET_X_PX;

  const effectiveOffset = useMemo<[number, number]>(() => {
    const px = Number(popupOffsetPx);
    const py = (Number.isFinite(px) && px > 0 ? px : DEFAULT_POPUP_OFFSET_PX) / 2;
    const x = Number(popupOffsetXPx);
    const pxX = Number.isFinite(x) ? x : DEFAULT_POPUP_OFFSET_X_PX;
    return [pxX, -py];
  }, [popupOffsetPx, popupOffsetXPx]);

  useEffect(() => {
    if (!map) return;
    if (!mapReady) return;
    if (selectedDeviceId == null || !selectedPosition) return;
    if (Number(selectedPosition.deviceId) !== Number(selectedDeviceId)) return;
    if (userInteractingRef.current) return;

    const fixTime = selectedPosition.fixTime ?? null;
    const shouldLocate = lastLocateTickRef.current !== selectionTick;
    const shouldFollowUpdate =
      followSelected && fixTime != null && fixTime !== lastCenteredFixTimeRef.current;

    if (!shouldLocate && !shouldFollowUpdate) return;

    lastLocateTickRef.current = selectionTick;
    lastCenteredFixTimeRef.current = (fixTime ?? lastCenteredFixTimeRef.current) as any;

    const currentZoom = typeof map.getZoom === "function" ? map.getZoom() : 0;
    map.easeTo({
      center: [selectedPosition.longitude, selectedPosition.latitude],
      zoom: shouldLocate
        ? Math.max(currentZoom, selectZoom ?? DEFAULT_SELECT_ZOOM, MIN_SELECT_ZOOM)
        : currentZoom,
      offset: effectiveOffset,
    });
  }, [effectiveOffset, followSelected, map, mapReady, selectZoom, selectedDeviceId, selectedPosition, selectionTick]);

  return null;
}

MapSelectedDevice.handlesMapReady = true;

