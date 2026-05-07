import { useCallback, useEffect, useMemo, useState } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { PositionLite } from "../../map/types";

type DeviceRow = { id: number; name?: string | null; uniqueId?: string | null; attributes?: Record<string, unknown> | null };

type UserRow = { id: number | string; name?: string | null; email?: string | null };

type PermissionRow = { userId?: number | string; deviceId?: number | string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizePermissions(raw: unknown): PermissionRow[] {
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (isRecord(raw) && Array.isArray(raw.data)) {
    list = raw.data;
  }
  return list
    .filter(isRecord)
    .map((r) => ({ userId: r.userId as any, deviceId: r.deviceId as any }));
}

function buildDeviceUsersMap(users: UserRow[], permissions: PermissionRow[]) {
  const byId = new Map<string, UserRow>();
  users.forEach((u) => byId.set(String(u.id), u));
  const map = new Map<number, UserRow[]>();
  permissions.forEach((p) => {
    const deviceId = Number(p.deviceId);
    if (!Number.isFinite(deviceId)) return;
    const user = byId.get(String(p.userId));
    if (!user) return;
    const list = map.get(deviceId) ?? [];
    list.push(user);
    map.set(deviceId, list);
  });
  return map;
}

export type AlarmRow = {
  id: string;
  deviceId: number;
  plate: string;
  alarm: string;
  fixTime?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  operators: string[];
};

export function useOperationsAlarmsData() {
  const { api, config } = useScada();

  const [positions, setPositions] = useState<PositionLite[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pos, devs, us, perms] = await Promise.all([
        api.get<PositionLite[]>("/api/positions").catch(() => []),
        api.get<DeviceRow[]>("/api/devices?all=true").catch(() => []),
        api.get<UserRow[]>("/api/users").catch(() => []),
        api.get<unknown>("/api/permissions").catch(() => []),
      ]);
      setPositions(Array.isArray(pos) ? pos : []);
      setDevices(Array.isArray(devs) ? devs : []);
      setUsers(Array.isArray(us) ? us : []);
      setPermissions(normalizePermissions(perms));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const devicesById = useMemo(() => {
    const map = new Map<number, DeviceRow>();
    devices.forEach((d) => map.set(Number(d.id), d));
    return map;
  }, [devices]);

  const deviceUsersMap = useMemo(() => buildDeviceUsersMap(users, permissions), [users, permissions]);

  const alarms = useMemo<AlarmRow[]>(() => {
    const injected = config.devicesById ?? {};

    return positions
      .filter((p) => Boolean(p.attributes?.alarm))
      .map((p) => {
        const deviceId = p.deviceId;
        const alarm = p.attributes?.alarm;
        const device = devicesById.get(deviceId);
        const injectedName = injected[String(deviceId)]?.name ?? null;

        const plate =
          (device?.attributes?.plate as string | undefined) ||
          (device?.name ?? undefined) ||
          injectedName ||
          device?.uniqueId ||
          `#${deviceId}`;

        const operators = (deviceUsersMap.get(deviceId) ?? [])
          .map((u) => u.name || u.email || "")
          .filter(Boolean);

        const alarmKey = typeof alarm === "string" ? alarm : "alarm";
        const rowId = p.id == null ? `${deviceId}-${alarmKey}` : String(p.id);

        return {
          id: rowId,
          deviceId,
          plate,
          alarm: alarmKey,
          fixTime: (p.fixTime as any) ?? null,
          latitude: p.latitude,
          longitude: p.longitude,
          operators: operators.length ? operators : ["Sin operador"],
        };
      })
      .sort((a, b) => String(b.fixTime ?? "").localeCompare(String(a.fixTime ?? "")));
  }, [config.devicesById, deviceUsersMap, devicesById, positions]);

  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        value: String(u.id),
        label: u.name || u.email || String(u.id),
      })),
    [users],
  );

  return { alarms, positions, users, userOptions, loading, error, refresh };
}

