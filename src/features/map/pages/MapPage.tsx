import { useCallback, useMemo, useState } from "react";
import MapView from "../traccar/MapView";
import { DevicesSidebar } from "../components/DevicesSidebar";
import { MapPositions } from "../traccar/MapPositions";
import { MapSelectedDevice } from "../traccar/MapSelectedDevice";
import { MapCurrentLocation } from "../traccar/MapCurrentLocation";
import { MapScale } from "../traccar/MapScale";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { DeviceLite, PositionLite } from "../types";
import { MapOverlay } from "../traccar/overlay/MapOverlay";
import { MapGeofence } from "../traccar/MapGeofence";
import { MapAccuracy } from "../traccar/main/MapAccuracy";
import { MapLiveRoutes } from "../traccar/main/MapLiveRoutes";
import { MapDefaultCamera } from "../traccar/main/MapDefaultCamera";
import { PoiMap } from "../traccar/main/PoiMap";
import { MapGeocoder } from "../traccar/geocoder/MapGeocoder";
import { MapNotification } from "../traccar/notification/MapNotification";
import { MapPadding } from "../traccar/MapPadding";
import { StatusCard } from "../components/StatusCard";

export function MapPage() {
  const { config } = useScada();
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectionTick, setSelectionTick] = useState(0);

  const onSelectDevice = useCallback((deviceId: number | null) => {
    setSelectedDeviceId(deviceId);
    setSelectionTick((t) => t + 1);
  }, []);

  const devicesById = (config.devicesById ?? {}) as unknown as Record<string, DeviceLite>;
  const rawPositions = config.positions as unknown;
  const rawPositionsDebug = useMemo(() => {
    if (rawPositions == null) return "null";
    if (Array.isArray(rawPositions)) return `Array(${rawPositions.length})`;
    const ctor = (rawPositions as any)?.constructor?.name ?? "";
    const keys =
      typeof rawPositions === "object" && rawPositions !== null
        ? Object.keys(rawPositions as any).length
        : "-";
    return `${typeof rawPositions} ${ctor} keys=${keys}`;
  }, [rawPositions]);

  const positions = useMemo<PositionLite[]>(() => {
    const raw = rawPositions;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as PositionLite[];
    if (raw instanceof Map) return Array.from(raw.values()) as PositionLite[];
    const maybeIterable = raw as any;
    if (maybeIterable && typeof maybeIterable.values === "function" && typeof maybeIterable[Symbol.iterator] === "function") {
      try {
        return Array.from(maybeIterable.values()) as PositionLite[];
      } catch {
      }
    }
    if (typeof raw === "object") return Object.values(raw as Record<string, PositionLite>);
    return [];
  }, [rawPositions]);

  const normalizedPositions = useMemo<PositionLite[]>(() => {
    return positions.map((p) => {
      const attrs = (p as any)?.attributes;
      if (typeof attrs === "string") {
        try {
          return { ...(p as any), attributes: JSON.parse(attrs) } as PositionLite;
        } catch {
          return p;
        }
      }
      return p;
    });
  }, [positions]);

  const selectedPosition = useMemo(() => {
    if (selectedDeviceId == null) return null;
    return normalizedPositions.find((p) => Number(p.deviceId) === selectedDeviceId) ?? null;
  }, [normalizedPositions, selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    if (selectedDeviceId == null) return null;
    return devicesById[String(selectedDeviceId)] ?? null;
  }, [devicesById, selectedDeviceId]);

  const kpis = useMemo(() => {
    const devices = Object.values(devicesById);
    const total = devices.length;
    const online = devices.filter((d) => String((d as any)?.status ?? "").toLowerCase() === "online").length;
    const offline = devices.filter((d) => String((d as any)?.status ?? "").toLowerCase() === "offline").length;
    const events = Array.isArray(config.events) ? (config.events as any[]) : [];
    const alarmed = events.length;
    return { total, online, offline, alarmed };
  }, [config.events, devicesById]);

  return (
    <div className="h-full w-full p-4">
      <div className="scada-content-grid h-full min-h-0">
        <div className="flex min-h-0 flex-col gap-4">
          <div className="scada-kpis">
        <div className="scada-kpi-card scada-kpi-card--danger">
          <div className="scada-kpi-card__top">
            <div>
              <div className="scada-kpi-card__label">Alarmados</div>
              <div className="scada-kpi-card__value">{kpis.alarmed}</div>
              <div className="scada-kpi-card__meta">Eventos activos</div>
            </div>
            <div className="scada-kpi-icon">!</div>
          </div>
        </div>

        <div className="scada-kpi-card scada-kpi-card--success">
          <div className="scada-kpi-card__top">
            <div>
              <div className="scada-kpi-card__label">En ruta</div>
              <div className="scada-kpi-card__value">{kpis.online}</div>
              <div className="scada-kpi-card__meta">Online</div>
            </div>
            <div className="scada-kpi-icon">✓</div>
          </div>
        </div>

        <div className="scada-kpi-card scada-kpi-card--muted">
          <div className="scada-kpi-card__top">
            <div>
              <div className="scada-kpi-card__label">Sin señal</div>
              <div className="scada-kpi-card__value">{kpis.offline}</div>
              <div className="scada-kpi-card__meta">Offline</div>
            </div>
            <div className="scada-kpi-icon">×</div>
          </div>
        </div>

        <div className="scada-kpi-card scada-kpi-card--info">
          <div className="scada-kpi-card__top">
            <div>
              <div className="scada-kpi-card__label">Total flota</div>
              <div className="scada-kpi-card__value">{kpis.total}</div>
              <div className="scada-kpi-card__meta">Dispositivos</div>
            </div>
            <div className="scada-kpi-icon">≡</div>
          </div>
        </div>
      </div>

          <div className="scada-map-surface min-h-0 min-w-0 flex-1">
          <MapView>
            {import.meta.env.DEV ? (
              <div className="pointer-events-none absolute left-3 top-12 z-30 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-white">
                positions: {positions.length}
              </div>
            ) : null}
            {import.meta.env.DEV ? (
              <div className="pointer-events-none absolute left-3 top-[68px] z-30 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-white">
                rawPositions: {rawPositionsDebug}
              </div>
            ) : null}
            <MapOverlay />
            <MapGeofence onGeofenceSelected={() => {}} />
            <MapAccuracy positions={normalizedPositions} />
            <MapLiveRoutes
              deviceIds={normalizedPositions.map((p) => p.deviceId)}
              positions={normalizedPositions}
            />
            <MapPositions
              positions={normalizedPositions}
              devicesById={devicesById}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={(id) => onSelectDevice(id)}
            />
            <MapDefaultCamera selectedDeviceId={selectedDeviceId} positions={normalizedPositions} />
            <MapSelectedDevice
              selectedDeviceId={selectedDeviceId}
              selectedPosition={selectedPosition}
              selectionTick={selectionTick}
            />
            <PoiMap />
            {selectedDeviceId == null ? null : (
              <StatusCard
                deviceId={selectedDeviceId}
                device={selectedDevice}
                position={selectedPosition}
                onClose={() => onSelectDevice(null)}
              />
            )}
            <MapScale />
            <MapCurrentLocation />
            <MapGeocoder />
            <MapNotification enabled={Boolean((config.events ?? []).length)} onClick={() => {}} />
            <MapPadding start={0} />
          </MapView>
        </div>
        </div>

        <DevicesSidebar
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={onSelectDevice}
        />
      </div>
    </div>
  );
}
