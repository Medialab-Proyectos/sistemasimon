import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — KpiCard (Organism / Domain)
 *
 * KPI metric display: icon + title + value + trend indicator.
 * Trend: up (success), down (error), neutral
 * ────────────────────────────────────────────── */

export type KpiTrend = "up" | "down" | "neutral";

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  value: string | number;
  trend?: KpiTrend;
  trendValue?: string;
  trendLabel?: string;
}

export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(
  (
    {
      icon,
      title,
      value,
      trend,
      trendValue,
      trendLabel,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`ds-kpi-card ${className}`.trim()} {...rest}>
        {icon && <span className="ds-kpi-card__icon">{icon}</span>}
        <div className="ds-kpi-card__body">
          <span className="ds-kpi-card__title">{title}</span>
          <span className="ds-kpi-card__value">{value}</span>
          {trend && (
            <div className="ds-kpi-card__footer">
              <span className={`ds-kpi-card__trend ds-kpi-card__trend--${trend}`}>
                {trend === "up" && <ArrowUpIcon />}
                {trend === "down" && <ArrowDownIcon />}
                {trend === "neutral" && <MinusIcon />}
                {trendValue}
              </span>
              {trendLabel && <span className="ds-kpi-card__title">{trendLabel}</span>}
            </div>
          )}
        </div>
      </div>
    );
  },
);

KpiCard.displayName = "KpiCard";

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
