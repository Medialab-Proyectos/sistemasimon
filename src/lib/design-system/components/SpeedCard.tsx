import { forwardRef, type HTMLAttributes } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — SpeedCard / Velocidad (Organism / Domain)
 *
 * Circular speed gauge with value, unit, label, and meta info.
 * Color zones: normal (success), warning, danger (error).
 * ────────────────────────────────────────────── */

export type SpeedZone = "normal" | "warning" | "danger";

export interface SpeedMetaItem {
  label: string;
  value: string | number;
}

export interface SpeedCardProps extends HTMLAttributes<HTMLDivElement> {
  speed: number;
  maxSpeed?: number;
  unit?: string;
  label?: string;
  zone?: SpeedZone;
  meta?: SpeedMetaItem[];
}

const CIRCUMFERENCE = 2 * Math.PI * 40; // radius=40
const ARC_FRACTION = 0.75; // 270° arc

export const SpeedCard = forwardRef<HTMLDivElement, SpeedCardProps>(
  (
    {
      speed,
      maxSpeed = 200,
      unit = "km/h",
      label,
      zone,
      meta,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const ratio = Math.min(speed / maxSpeed, 1);
    const arcLength = CIRCUMFERENCE * ARC_FRACTION;
    const offset = arcLength * (1 - ratio);
    const resolvedZone = zone ?? (ratio <= 0.5 ? "normal" : ratio <= 0.75 ? "warning" : "danger");

    return (
      <div ref={ref} className={`ds-speed-card ${className}`.trim()} {...rest}>
        <div className="ds-speed-card__gauge">
          <svg className="ds-speed-card__gauge-circle" viewBox="0 0 96 96">
            <circle
              className="ds-speed-card__gauge-bg"
              cx="48" cy="48" r="40"
              strokeDasharray={`${arcLength} ${CIRCUMFERENCE}`}
              strokeDashoffset="0"
              transform="rotate(135 48 48)"
            />
            <circle
              className={`ds-speed-card__gauge-fill ds-speed-card__gauge-fill--${resolvedZone}`}
              cx="48" cy="48" r="40"
              strokeDasharray={`${arcLength} ${CIRCUMFERENCE}`}
              strokeDashoffset={offset}
              transform="rotate(135 48 48)"
            />
          </svg>
          <div className="ds-speed-card__value-wrap">
            <span className="ds-speed-card__value">{speed}</span>
            <span className="ds-speed-card__unit">{unit}</span>
          </div>
        </div>

        {label && <span className="ds-speed-card__label">{label}</span>}

        {meta && meta.length > 0 && (
          <div className="ds-speed-card__meta">
            {meta.map((m, i) => (
              <div key={i} className="ds-speed-card__meta-item">
                <span className="ds-speed-card__meta-value">{m.value}</span>
                <span className="ds-speed-card__meta-label">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

SpeedCard.displayName = "SpeedCard";
