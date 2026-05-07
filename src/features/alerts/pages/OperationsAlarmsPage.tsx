import { useMemo, useState } from "react";
import { Button, Input } from "../../../shared/ui/atoms";
import { useScada } from "../../../app/remote/ScadaProvider";
import { useOperationsAlarmsData } from "../hooks/useOperationsAlarmsData";
import {
  TIPIFICACION_OPTS,
  HIST_ALARM_TYPE_OPTS,
} from "../constants/alarmConstants";
import { AssignAlarmDialog } from "../components/AssignAlarmDialog";
import { BulkAssignAlarmDialog } from "../components/BulkAssignAlarmDialog";
import MapView from "../../map/traccar/MapView";
import { AlarmMapOverlay } from "../components/AlarmMapOverlay";

function formatDateTime(value: unknown) {
  if (!value) return "";
  const raw =
    typeof value === "string" || typeof value === "number" ? String(value) : "";
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export function OperationsAlarmsPage() {
  const { config } = useScada();
  const { alarms, userOptions, loading, error, refresh } =
    useOperationsAlarmsData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [queueSearch, setQueueSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const [typification, setTypification] = useState("");
  const [typificationNote, setTypificationNote] = useState("");

  const [histDate, setHistDate] = useState("");
  const [histAlarmType, setHistAlarmType] = useState("");
  const [histTip, setHistTip] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [operatorOverrides, setOperatorOverrides] = useState<
    Record<string, string>
  >({});

  const filtered = useMemo(() => {
    const q = "";
    if (!q) return alarms;
    return alarms.filter((a) => {
      return (
        a.plate.toLowerCase().includes(q) ||
        String(a.deviceId).includes(q) ||
        a.alarm.toLowerCase().includes(q)
      );
    });
  }, [alarms]);

  const queue = useMemo(() => {
    const needle = queueSearch.trim().toLowerCase();
    let list = filtered;
    if (needle) {
      list = list.filter((a) => a.plate.toLowerCase().includes(needle));
    }
    const sorted = [...list].sort((a, b) => {
      const av = String(a.fixTime ?? "");
      const bv = String(b.fixTime ?? "");
      return sortDesc ? bv.localeCompare(av) : av.localeCompare(bv);
    });
    return sorted;
  }, [filtered, queueSearch, sortDesc]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return alarms.find((a) => a.id === selectedId) ?? null;
  }, [alarms, selectedId]);

  const selectedOperator = useMemo(() => {
    if (!selected) return null;
    return operatorOverrides[selected.id] ?? selected.operators[0] ?? null;
  }, [operatorOverrides, selected]);

  const mapsUrl = useMemo(() => {
    if (!selected) return "";
    const lat = selected.latitude;
    const lng = selected.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") return "";
    if (Number.isNaN(lat) || Number.isNaN(lng)) return "";
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }, [selected]);

  const wazeUrl = useMemo(() => {
    if (!selected) return "";
    const lat = selected.latitude;
    const lng = selected.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") return "";
    if (Number.isNaN(lat) || Number.isNaN(lng)) return "";
    return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }, [selected]);

  const onAssignConfirm = (userId: string) => {
    const label = userOptions.find((u) => u.value === userId)?.label ?? userId;
    if (!selected) return;
    setOperatorOverrides((prev) => ({ ...prev, [selected.id]: label }));
    setAssignOpen(false);
  };

  const onBulkConfirm = (userIds: string[]) => {
    const labels = userIds.map(
      (id) => userOptions.find((u) => u.value === id)?.label ?? id,
    );
    const targets = alarms.filter(
      (a) => (a.operators[0] ?? "") === "Sin operador",
    );
    if (!targets.length || !labels.length) {
      setBulkOpen(false);
      return;
    }
    setOperatorOverrides((prev) => {
      const next = { ...prev };
      let idx = 0;
      targets.forEach((t) => {
        next[t.id] = labels[idx % labels.length]!;
        idx += 1;
      });
      return next;
    });
    setBulkOpen(false);
  };

  const acknowledgeDisabled =
    !typification || typificationNote.trim().length === 0;

  const isDark = (config.themeMode ?? "light") === "dark";

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed top-0 right-0 h-[520px] w-[520px] rounded-full blur-[120px] -z-10 opacity-60 bg-(--color-primary-hover)/10" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-[520px] w-[520px] rounded-full blur-[120px] -z-10 opacity-60 bg-secondary/10" />

      <div className="flex flex-col gap-6 p-4 sm:p-10 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void refresh()}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {error ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "border-red-500/30 bg-red-950/30 text-red-200"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-4 gap-6 lg:grid-cols-2 lg:grid-rows-2 [&>div]:min-h-0">
          {/* Details */}
          <div
            className={`overflow-hidden flex flex-col rounded-2xl border ${
              isDark
                ? "bg-surface-elevated border-border-subtle"
                : "bg-white/70 backdrop-blur-md border-gray-100 shadow-xl shadow-gray-200/50"
            }`}
          >
            <div
              className={`px-5 py-4 border-b ${
                isDark
                  ? "border-border-subtle bg-surface"
                  : "border-gray-50 bg-gray-50/30"
              }`}
            >
              <div
                className={`text-sm font-bold tracking-tight ${
                  isDark ? "text-text" : "text-gray-800"
                }`}
              >
                Detalles de alarma
              </div>
            </div>
            <div className="p-5 flex-1 min-h-0 overflow-auto">
              {selected == null ? (
                <div
                  className={`py-16 text-center text-sm ${
                    isDark ? "text-text-muted" : "text-gray-500"
                  }`}
                >
                  Selecciona una alarma para ver más detalles.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-7 space-y-3">
                    <div
                      className={`flex flex-wrap items-center gap-3 border-b pb-3 ${
                        isDark ? "border-border-subtle" : "border-gray-100"
                      }`}
                    >
                      <div
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isDark ? "text-text-muted" : "text-gray-400"
                        }`}
                      >
                        Placa
                      </div>
                      <div
                        className={`text-lg font-extrabold truncate ${
                          isDark ? "text-text" : "text-gray-900"
                        }`}
                      >
                        {selected.plate}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          isDark ? "text-text-muted" : "text-gray-500"
                        }`}
                      >
                        #{selected.deviceId}
                      </div>
                      <div className="ml-auto inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span
                          className={`text-xs font-semibold ${
                            isDark ? "text-text" : "text-gray-800"
                          }`}
                        >
                          Alarmado
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <div
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            isDark ? "text-text-muted" : "text-gray-400"
                          }`}
                        >
                          Alarma
                        </div>
                        <div
                          className={`mt-0.5 font-medium ${
                            isDark ? "text-text" : "text-gray-900"
                          }`}
                        >
                          {selected.alarm}
                        </div>
                      </div>
                      <div>
                        <div
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            isDark ? "text-text-muted" : "text-gray-400"
                          }`}
                        >
                          Fecha
                        </div>
                        <div
                          className={`mt-0.5 font-medium ${
                            isDark ? "text-text" : "text-gray-900"
                          }`}
                        >
                          {formatDateTime(selected.fixTime) || "—"}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            isDark ? "text-text-muted" : "text-gray-400"
                          }`}
                        >
                          Operador
                        </div>
                        <div
                          className={`mt-0.5 font-medium ${
                            isDark ? "text-text" : "text-gray-900"
                          }`}
                        >
                          {selectedOperator ?? "—"}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            isDark ? "text-text-muted" : "text-gray-400"
                          }`}
                        >
                          Ubicación
                        </div>
                        <div
                          className={`mt-0.5 font-mono text-sm ${
                            isDark ? "text-text" : "text-gray-900"
                          }`}
                        >
                          {typeof selected.latitude === "number" &&
                          typeof selected.longitude === "number"
                            ? `${selected.latitude.toFixed(5)}, ${selected.longitude.toFixed(5)}`
                            : "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={mapsUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => !mapsUrl && e.preventDefault()}
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={!mapsUrl}
                        >
                          Google Maps
                        </Button>
                      </a>
                      <a
                        href={wazeUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => !wazeUrl && e.preventDefault()}
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={!wazeUrl}
                        >
                          Waze
                        </Button>
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setAssignOpen(true)}
                      >
                        Asignar
                      </Button>
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-5 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-4 space-y-3 ${
                      isDark ? "border-border-subtle" : "border-gray-100"
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                        Tipificación
                      </div>
                      <select
                        className={`mt-1 h-10 w-full rounded-xl px-3 text-sm outline-none ${
                          isDark
                            ? "border border-border-subtle bg-surface text-text focus:ring-2 focus:ring-primary/30"
                            : "border-2 border-gray-100 bg-gray-50/50 text-gray-900 focus:border-(--color-primary-hover)"
                        }`}
                        value={typification}
                        onChange={(e) => setTypification(e.target.value)}
                      >
                        {TIPIFICACION_OPTS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                        Describir motivos
                      </div>
                      <textarea
                        className={`mt-1 min-h-[90px] w-full resize-y rounded-xl px-3 py-2 text-sm outline-none ${
                          isDark
                            ? "border border-border-subtle bg-surface text-text focus:ring-2 focus:ring-primary/30"
                            : "border-2 border-gray-100 bg-gray-50/50 text-gray-900 focus:border-(--color-primary-hover)"
                        }`}
                        value={typificationNote}
                        onChange={(e) => setTypificationNote(e.target.value)}
                        placeholder="Comentarios…"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        disabled={acknowledgeDisabled}
                        onClick={() => {
                          // Placeholder action (no backend endpoint provided)
                          setTypification("");
                          setTypificationNote("");
                        }}
                      >
                        Reconocer alarma
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setTypification("");
                          setTypificationNote("");
                        }}
                      >
                        Limpiar campos
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Queue */}
          <div
            className={`overflow-hidden flex flex-col rounded-2xl border ${
              isDark
                ? "bg-surface-elevated border-border-subtle"
                : "bg-white/70 backdrop-blur-md border-gray-100 shadow-xl shadow-gray-200/50"
            }`}
          >
            <div
              className={`px-5 py-4 border-b ${
                isDark
                  ? "border-border-subtle bg-surface"
                  : "border-gray-50 bg-gray-50/30"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`text-sm font-bold tracking-tight ${
                    isDark ? "text-text" : "text-gray-800"
                  }`}
                >
                  Alarmas en cola
                </div>
                <div
                  className={`ml-auto text-xs ${
                    isDark ? "text-text-muted" : "text-gray-500"
                  }`}
                >
                  Activas:{" "}
                  <span
                    className={`font-semibold ${isDark ? "text-text" : "text-gray-900"}`}
                  >
                    {queue.length}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`px-5 py-4 flex flex-wrap items-center gap-2 border-b ${
                isDark ? "border-border-subtle" : "border-gray-100"
              }`}
            >
              <div className="flex-1 min-w-[180px]">
                <Input
                  placeholder="Buscar por placa"
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSortDesc((v) => !v)}
              >
                Orden: {sortDesc ? "Desc" : "Asc"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setBulkOpen(true)}
              >
                Asignar lote
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              {loading ? (
                <div
                  className={`p-5 text-sm ${isDark ? "text-text-muted" : "text-gray-500"}`}
                >
                  Cargando…
                </div>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead
                    className={`${isDark ? "bg-surface text-text-muted" : "bg-gray-50/40 text-gray-500"}`}
                  >
                    <tr className="text-left">
                      <th className="px-3 py-2 font-semibold">Placa</th>
                      <th className="px-3 py-2 font-semibold">Alarma</th>
                      <th className="px-3 py-2 font-semibold">Fecha</th>
                      <th className="px-3 py-2 font-semibold">Operador</th>
                      <th className="px-3 py-2 font-semibold text-center w-28">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((a) => {
                      const isSelected = selectedId === a.id;
                      const op = operatorOverrides[a.id] ?? a.operators[0];
                      const rowBg = (() => {
                        if (isSelected) return isDark ? "bg-surface-elevated" : "bg-emerald-50/40";
                        return isDark ? "hover:bg-surface" : "hover:bg-gray-50/60";
                      })();
                      return (
                        <tr
                          key={a.id}
                          className={`border-t ${isDark ? "border-border-subtle" : "border-gray-100"} ${rowBg}`}
                        >
                          <td
                            className={`px-3 py-2 font-semibold ${isDark ? "text-text" : "text-gray-900"}`}
                          >
                            <button
                              type="button"
                              className="text-left"
                              onClick={() => setSelectedId(a.id)}
                            >
                              {a.plate}
                            </button>
                          </td>
                          <td
                            className={`px-3 py-2 ${isDark ? "text-text" : "text-gray-900"}`}
                          >
                              {a.alarm}
                            </td>
                          <td
                            className={`px-3 py-2 text-xs ${isDark ? "text-text-muted" : "text-gray-500"}`}
                          >
                            {formatDateTime(a.fixTime) || "—"}
                          </td>
                          <td
                            className={`px-3 py-2 ${isDark ? "text-text-muted" : "text-gray-500"}`}
                          >
                              {op}
                            </td>
                          <td className="px-3 py-2 text-center">
                            <Button
                              type="button"
                              size="sm"
                                className="bg-linear-to-r from-(--color-primary-hover) to-primary text-[--color-text-on-primary]"
                              onClick={() => {
                                setSelectedId(a.id);
                                setAssignOpen(true);
                              }}
                            >
                              Asignar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* History */}
          <div
            className={`overflow-hidden flex flex-col rounded-2xl border ${
              isDark
                ? "bg-surface-elevated border-border-subtle"
                : "bg-white/70 backdrop-blur-md border-gray-100 shadow-xl shadow-gray-200/50"
            }`}
          >
            <div
              className={`px-5 py-4 border-b ${
                isDark
                  ? "border-border-subtle bg-surface"
                  : "border-gray-50 bg-gray-50/30"
              }`}
            >
              <div
                className={`text-sm font-bold tracking-tight ${
                  isDark ? "text-text" : "text-gray-800"
                }`}
              >
                Histórico placa{selected ? `: ${selected.plate}` : ""}
              </div>
            </div>
            <div
              className={`px-5 py-4 flex flex-wrap items-center gap-2 border-b ${
                isDark ? "border-border-subtle" : "border-gray-100"
              }`}
            >
              <input
                type="datetime-local"
                className={`h-10 rounded-xl px-3 text-sm outline-none ${
                  isDark
                    ? "border border-border-subtle bg-surface text-text focus:ring-2 focus:ring-primary/30"
                    : "border-2 border-gray-100 bg-gray-50/50 text-gray-900 focus:border-(--color-primary-hover)"
                }`}
                value={histDate}
                onChange={(e) => setHistDate(e.target.value)}
              />
              <select
                className={`h-10 rounded-xl px-3 text-sm outline-none ${
                  isDark
                    ? "border border-border-subtle bg-surface text-text focus:ring-2 focus:ring-primary/30"
                    : "border-2 border-gray-100 bg-gray-50/50 text-gray-900 focus:border-(--color-primary-hover)"
                }`}
                value={histAlarmType}
                onChange={(e) => setHistAlarmType(e.target.value)}
              >
                {HIST_ALARM_TYPE_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                className={`h-10 rounded-xl px-3 text-sm outline-none ${
                  isDark
                    ? "border border-border-subtle bg-surface text-text focus:ring-2 focus:ring-primary/30"
                    : "border-2 border-gray-100 bg-gray-50/50 text-gray-900 focus:border-(--color-primary-hover)"
                }`}
                value={histTip}
                onChange={(e) => setHistTip(e.target.value)}
              >
                {TIPIFICACION_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label || "Tipificación"}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setHistDate("");
                  setHistAlarmType("");
                  setHistTip("");
                }}
              >
                Limpiar
              </Button>
            </div>
            <div
              className={`flex-1 min-h-0 flex items-center justify-center p-6 text-sm ${
                isDark ? "text-text-muted" : "text-gray-500"
              }`}
            >
              No hay registros disponibles
            </div>
          </div>

          {/* Map */}
          <div
            className={`overflow-hidden flex flex-col rounded-2xl border ${
              isDark
                ? "bg-surface-elevated border-border-subtle"
                : "bg-white/70 backdrop-blur-md border-gray-100 shadow-xl shadow-gray-200/50"
            }`}
          >
            <div
              className={`px-5 py-4 border-b ${
                isDark
                  ? "border-border-subtle bg-surface"
                  : "border-gray-50 bg-gray-50/30"
              }`}
            >
              <div
                className={`text-sm font-bold tracking-tight ${
                  isDark ? "text-text" : "text-gray-800"
                }`}
              >
                Mapa
              </div>
            </div>
            <div className="relative flex-1 min-h-[200px]">
              {selected == null ? (
                <div
                  className={`absolute inset-0 z-10 flex items-center justify-center p-6 text-center text-sm ${
                    isDark
                      ? "bg-surface/85 text-text-muted"
                      : "bg-white/75 text-gray-500"
                  }`}
                >
                  Selecciona una alarma para ver el mapa.
                </div>
              ) : null}
              <div className="absolute inset-0">
                <MapView>
                  <AlarmMapOverlay alarms={alarms} selectedId={selectedId} />
                </MapView>
              </div>
            </div>
          </div>
        </div>

        <AssignAlarmDialog
          open={assignOpen && selected != null}
          plate={selected?.plate ?? ""}
          userOptions={userOptions}
          onClose={() => setAssignOpen(false)}
          onConfirm={onAssignConfirm}
        />
        <BulkAssignAlarmDialog
          open={bulkOpen}
          userOptions={userOptions}
          onClose={() => setBulkOpen(false)}
          onConfirm={onBulkConfirm}
        />
      </div>
    </div>
  );
}
