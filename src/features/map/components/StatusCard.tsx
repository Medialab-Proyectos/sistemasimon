import { useMemo } from "react";

import type { DeviceLite, PositionLite } from "../types";

function safeNum(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function safeStr(v: unknown) {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function formatAgo(isoOrMs: unknown) {
  if (isoOrMs == null) return null;
  let ms = Number.NaN;
  if (typeof isoOrMs === "number") ms = isoOrMs;
  else if (typeof isoOrMs === "string") ms = Date.parse(isoOrMs);
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

function normalizeStatus(status: unknown) {
  const s = typeof status === "string" ? status.toLowerCase() : "";
  if (s === "online" || s === "offline" || s === "unknown") return s;
  return "unknown";
}

function statusUi(statusKey: string) {
  if (statusKey === "online") return { label: "Estado en ruta", pill: "scada-pill--success" };
  if (statusKey === "offline") return { label: "Estado alarmado", pill: "scada-pill--danger" };
  return { label: "Estado desconocido", pill: "scada-pill--muted" };
}

function clampPercent(v: number | null) {
  if (v == null) return null;
  return Math.max(0, Math.min(100, v));
}

export function StatusCard({
  deviceId,
  device,
  position,
  onClose,
}: Readonly<{
  deviceId: number;
  device: DeviceLite | null;
  position: PositionLite | null;
  onClose: () => void;
}>) {
  const title = useMemo(() => {
    if (!device) return `#${deviceId}`;
    const plate = typeof device.attributes?.plate === "string" ? device.attributes.plate : "";
    return plate || device.name || device.uniqueId || `#${deviceId}`;
  }, [device, deviceId]);

  const lat = safeNum(position?.latitude);
  const lng = safeNum(position?.longitude);

  const view = useMemo(() => {
    if (!device || !position) {
      return {
        model: "—",
        lastUpdateText: "—",
        address: "—",
        status: statusUi("unknown"),
        eventLabel: "—",
        eventPill: "scada-pill--muted",
        vin: "—",
        avl: "—",
        contact: "—",
        phone: "—",
        brand: "—",
        color: "—",
        batteryMain: null as number | null,
        batteryBackup: null as number | null,
        speedText: "—",
        movementText: "—",
        mapsQuery: null as string | null,
      };
    }

    const attrs: any = device.attributes ?? {};
    const pAttrs: any = position.attributes ?? {};

    const model =
      safeStr(attrs.model) || safeStr(attrs.deviceModel) || safeStr((device as any)?.model) || "—";

    const lastUpdate = position.fixTime ?? (position as any)?.deviceTime ?? (position as any)?.serverTime ?? null;
    const lastUpdateText = formatAgo(lastUpdate) ?? "—";

    const address =
      safeStr(pAttrs.address) ||
      safeStr(pAttrs.formattedAddress) ||
      (lat != null && lng != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "—");

    const statusKey = normalizeStatus((device as any)?.status);
    const status = statusUi(statusKey);

    const moving = Boolean(pAttrs.motion) || Number(position.speed ?? 0) > 0.5;
    const eventLabel = moving ? "En movimiento" : "Sin movimiento";
    const eventPill = moving ? "scada-pill--success" : "scada-pill--muted";

    const batteryMain = clampPercent(safeNum(pAttrs.battery) ?? safeNum(pAttrs.batteryLevel));
    const batteryBackup = clampPercent(safeNum(pAttrs.battery2) ?? safeNum(pAttrs.backupBattery));

    const vin = safeStr(attrs.vin) ?? "—";
    const avl = safeStr(device.uniqueId) ?? "—";
    const contact = safeStr(attrs.contact) ?? safeStr(attrs.driver) ?? "—";
    const phone = safeStr(attrs.phone) ?? safeStr(attrs.telephone) ?? "—";
    const brand = safeStr(attrs.brand) ?? safeStr(attrs.make) ?? "—";
    const color = safeStr(attrs.color) ?? safeStr(attrs.vehicleColor) ?? "—";

    const speedN = safeNum(position.speed);
    const speedText = typeof speedN === "number" ? `${Number(speedN).toFixed(0)} km/h` : "—";
    const movementText = moving ? "en marcha" : "detenido";

    const hasCoords = typeof lat === "number" && typeof lng === "number";
    const mapsQuery = hasCoords ? encodeURIComponent(`${lat},${lng}`) : null;

    return {
      model,
      lastUpdateText,
      address,
      status,
      eventLabel,
      eventPill,
      vin,
      avl,
      contact,
      phone,
      brand,
      color,
      batteryMain,
      batteryBackup,
      speedText,
      movementText,
      mapsQuery,
    };
  }, [device, lat, lng, position]);

  if (!device || !position) return null;

  return (
    <div className="scada-status-card">
      <div className="scada-status-card__panel">
        <div className="scada-status-card__header">
          <div className="min-w-0">
            <div className="scada-status-card__title truncate">{title}</div>
            <div className="text-sm font-semibold text-text-muted truncate">{view.model}</div>
            <div className="scada-status-card__subtitle">Última actualización: {view.lastUpdateText}</div>
          </div>

          <div className="scada-status-card__actions">
            {view.mapsQuery ? (
              <a
                className="scada-icon-btn"
                href={`https://www.google.com/maps/search/?api=1&query=${view.mapsQuery}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Ver mapas"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M12 5c4.5 0 8 3.5 8 7s-3.5 7-8 7-8-3.5-8-7 3.5-7 8-7Z" stroke="currentColor" strokeWidth="1.7" opacity="0.9" />
                  <path d="M12 9.2c1.6 0 2.9 1.2 2.9 2.8 0 1.6-1.3 2.8-2.9 2.8s-2.9-1.2-2.9-2.8c0-1.6 1.3-2.8 2.9-2.8Z" fill="currentColor" opacity="0.9" />
                </svg>
              </a>
            ) : null}
            <button type="button" className="scada-icon-btn" onClick={onClose} aria-label="Cerrar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="scada-status-card__body scada-scrollbar">
          <div className="scada-location">
            <div className="scada-location__label">Ubicación</div>
            <div className="scada-location__value">{view.address}</div>
          </div>

          <div className="scada-section">
            <div className="scada-section__title">
              <span className="scada-section__bar" aria-hidden="true" />
              <span>Identificación</span>
            </div>
            <div className="scada-tiles">
              <div className="scada-tile">
                <div className="scada-tile__label">AVL</div>
                <div className="scada-tile__value">
                  <span className="truncate">{view.avl}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">VIN</div>
                <div className="scada-tile__value">
                  <span className="truncate">{view.vin}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Contacto</div>
                <div className="scada-tile__value">
                  <span className="truncate">{view.contact}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Teléfono</div>
                <div className="scada-tile__value">
                  <span className="truncate">{view.phone}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Marca</div>
                <div className="scada-tile__value">
                  <span className="truncate">{view.brand}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Color del vehículo</div>
                <div className="scada-tile__value">
                  <span className="truncate">{view.color}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="scada-section">
            <div className="scada-section__title">
              <span className="scada-section__bar" aria-hidden="true" />
              <span>Estado técnico</span>
            </div>
            <div className="scada-tiles">
              <div className="scada-tile">
                <div className="scada-tile__label">Estado</div>
                <div className="scada-tile__value">
                  <span className={["scada-pill", view.status.pill].join(" ")}>{view.status.label}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Evento</div>
                <div className="scada-tile__value">
                  <span className={["scada-pill", view.eventPill].join(" ")}>{view.eventLabel}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Red</div>
                <div className="scada-tile__value">
                  <span className={["scada-pill", "scada-pill--success"].join(" ")}>GPS activo</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Comunicación</div>
                <div className="scada-tile__value">
                  <span className={["scada-pill", "scada-pill--success"].join(" ")}>Conectado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="scada-section">
            <div className="scada-section__title">
              <span className="scada-section__bar" aria-hidden="true" />
              <span>Batería</span>
            </div>
            <div className="scada-progress">
              <div className="scada-progress__row">
                <div className="scada-progress__top">
                  <span className="scada-progress__label">Batería del principal</span>
                  <span className="scada-progress__value">{typeof view.batteryMain === "number" ? `${view.batteryMain}%` : "—"}</span>
                </div>
                <div className="scada-progress__bar">
                  <div
                    className="scada-progress__fill"
                    style={{ width: `${view.batteryMain ?? 0}%` }}
                  />
                </div>
              </div>
              <div className="scada-progress__row">
                <div className="scada-progress__top">
                  <span className="scada-progress__label">Batería de respaldo</span>
                  <span className="scada-progress__value">{typeof view.batteryBackup === "number" ? `${view.batteryBackup}%` : "—"}</span>
                </div>
                <div className="scada-progress__bar">
                  <div
                    className="scada-progress__fill"
                    style={{ width: `${view.batteryBackup ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="scada-section">
            <div className="scada-section__title">
              <span className="scada-section__bar" aria-hidden="true" />
              <span>Operación</span>
            </div>
            <div className="scada-tiles">
              <div className="scada-tile">
                <div className="scada-tile__label">Velocidad</div>
                <div className="scada-tile__value">
                  <span>{view.speedText}</span>
                </div>
              </div>
              <div className="scada-tile">
                <div className="scada-tile__label">Movimiento</div>
                <div className="scada-tile__value">
                  <span className={["scada-pill", view.eventPill].join(" ")}>{view.movementText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scada-status-card__footer">
          <div className="scada-footer-actions">
            <button type="button" className="scada-btn scada-btn--outline">
              Ir a comandos
            </button>
            <button type="button" className="scada-btn scada-btn--solid">
              Ver reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

