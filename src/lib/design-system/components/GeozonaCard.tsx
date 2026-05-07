import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — GeozonaCard (Organism / Domain)
 *
 * Covers "GEOZONA CARD" (compact) and "GEOZONA CARD 2" (expanded).
 * Geofence zone display with accent bar, icon, name, meta info, actions.
 * ────────────────────────────────────────────── */

export type GeozonaAccent = "brand" | "success" | "warning" | "error" | "neutral";
export type GeozonaVariant = "compact" | "expanded";

export interface GeozonaMetaItem {
  icon?: ReactNode;
  text: string;
}

export interface GeozonaCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GeozonaVariant;
  accent?: GeozonaAccent;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  meta?: GeozonaMetaItem[];
  mapSrc?: string;
  actions?: ReactNode;
}

const accentClass: Record<GeozonaAccent, string> = {
  brand: "",
  success: "ds-geozona-card__accent--success",
  warning: "ds-geozona-card__accent--warning",
  error: "ds-geozona-card__accent--error",
  neutral: "ds-geozona-card__accent--neutral",
};

export const GeozonaCard = forwardRef<HTMLDivElement, GeozonaCardProps>(
  (
    {
      variant = "compact",
      accent = "brand",
      icon,
      title,
      subtitle,
      meta,
      mapSrc,
      actions,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const isExpanded = variant === "expanded";

    return (
      <div
        ref={ref}
        className={`ds-geozona-card ${isExpanded ? "ds-geozona-card--expanded" : ""} ${className}`.trim()}
        {...rest}
      >
        <div className={`ds-geozona-card__accent ${accentClass[accent]}`} />

        {isExpanded && mapSrc && (
          <div className="ds-geozona-card__map">
            <img src={mapSrc} alt={`Mapa de ${title}`} />
          </div>
        )}

        <div className="ds-geozona-card__body">
          {icon && <span className="ds-geozona-card__icon">{icon}</span>}
          <div className="ds-geozona-card__content">
            <span className="ds-geozona-card__title">{title}</span>
            {subtitle && <span className="ds-geozona-card__subtitle">{subtitle}</span>}
            {meta && meta.length > 0 && (
              <div className="ds-geozona-card__meta">
                {meta.map((m, i) => (
                  <span key={i} className="ds-geozona-card__meta-item">
                    {m.icon}
                    {m.text}
                  </span>
                ))}
              </div>
            )}
          </div>
          {actions && <div className="ds-geozona-card__actions">{actions}</div>}
        </div>
      </div>
    );
  },
);

GeozonaCard.displayName = "GeozonaCard";
