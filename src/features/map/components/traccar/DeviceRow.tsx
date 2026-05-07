import type { DeviceLite } from "../../types";

function normalizeStatus(status: unknown) {
  if (typeof status !== "string") return "unknown";
  const s = status.toLowerCase();
  if (s === "online" || s === "offline" || s === "unknown") return s;
  return "unknown";
}

function safeIsoString(v: unknown) {
  return typeof v === "string" && v.length > 10 ? v : null;
}

function formatAgo(isoMaybe: string | null) {
  if (!isoMaybe) return null;
  const ms = Date.parse(isoMaybe);
  if (!Number.isFinite(ms)) return null;
  const diff = Date.now() - ms;
  if (!Number.isFinite(diff) || diff < 0) return null;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Hace < 1 min";
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  return `Hace ${d} d`;
}

export function DeviceRow({
  device,
  selected,
  onSelect,
}: Readonly<{
  device: DeviceLite;
  selected: boolean;
  onSelect: () => void;
}>) {
  const plate = typeof device.attributes?.plate === "string" ? device.attributes.plate : "";
  const name = plate || device.name || device.uniqueId || `#${device.id}`;
  const statusKey = normalizeStatus((device as any).status);

  let ui: {
    barClass: string;
    statusClass: string;
    statusLabel: string;
    chipClass: string;
    chipLabel: string;
  };
  if (statusKey === "online") {
    ui = {
      barClass: "bg-success",
      statusClass: "text-success",
      statusLabel: "Estado en ruta",
      chipClass: "scada-chip--success",
      chipLabel: "En movimiento",
    };
  } else if (statusKey === "offline") {
    ui = {
      barClass: "bg-error",
      statusClass: "text-error",
      statusLabel: "Estado alarmado",
      chipClass: "scada-chip--danger",
      chipLabel: "Sin señal",
    };
  } else {
    ui = {
      barClass: "bg-[color:color-mix(in_oklab,var(--color-text-muted)_55%,transparent)]",
      statusClass: "text-text-muted",
      statusLabel: "Estado desconocido",
      chipClass: "scada-chip--muted",
      chipLabel: "Sin señal",
    };
  }

  const lastUpdate =
    safeIsoString((device as any)?.lastUpdate) ??
    safeIsoString((device as any)?.attributes?.lastUpdate) ??
    safeIsoString((device as any)?.attributes?.lastUpdateTime) ??
    null;
  const ago = formatAgo(lastUpdate);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "scada-device-card w-full text-left relative transition",
        selected ? "border-[color-mix(in_oklab,var(--color-primary)_55%,var(--color-border-subtle))] shadow-sm" : "",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-2 top-3 bottom-3 w-1 rounded-full",
          ui.barClass,
        ].join(" ")}
        aria-hidden="true"
      />

      <div className="scada-device-card__top pl-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="scada-device-card__title truncate">{name}</div>
            </div>
            <div className={["scada-device-card__status shrink-0", ui.statusClass].join(" ")}>
              {ui.statusLabel}
            </div>
          </div>

          <div className={["scada-chip", ui.chipClass].join(" ")}>{ui.chipLabel}</div>
          <div className="scada-device-card__time">{ago ?? "—"}</div>
        </div>
      </div>
    </button>
  );
}

