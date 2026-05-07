import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — VehicleCard (Organism / Domain)
 *
 * Covers both "Vehicle Card Corporativo" (full) and
 * "Vehicle Card Plataforma" (compact) variants from Figma.
 *
 * Full: image + name + plate + info rows + status + actions
 * Compact: small image + name + subtitle + actions inline
 * ────────────────────────────────────────────── */

export type VehicleCardVariant = "full" | "compact";

export interface VehicleInfoRow {
  icon?: ReactNode;
  label: string;
  value: string;
}

export interface VehicleCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VehicleCardVariant;
  name: string;
  plate?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  statusBadge?: ReactNode;
  infoRows?: VehicleInfoRow[];
  actions?: ReactNode;
}

export const VehicleCard = forwardRef<HTMLDivElement, VehicleCardProps>(
  (
    {
      variant = "full",
      name,
      plate,
      subtitle,
      imageSrc,
      imageAlt,
      statusBadge,
      infoRows,
      actions,
      className = "",
      ...rest
    },
    ref,
  ) => {
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={`ds-vehicle-card ds-vehicle-card--compact ${className}`.trim()}
          {...rest}
        >
          {imageSrc && (
            <div className="ds-vehicle-card__image">
              <img src={imageSrc} alt={imageAlt ?? name} />
            </div>
          )}
          <div className="ds-vehicle-card__body">
            <span className="ds-vehicle-card__name">{name}</span>
            {subtitle && <span className="ds-vehicle-card__row-label">{subtitle}</span>}
            {statusBadge}
          </div>
          {actions && <div className="ds-vehicle-card__footer">{actions}</div>}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`ds-vehicle-card ${className}`.trim()}
        {...rest}
      >
        <div className="ds-vehicle-card__header">
          <span className="ds-vehicle-card__name">{name}</span>
          {plate && <span className="ds-vehicle-card__plate">{plate}</span>}
          {statusBadge}
        </div>

        {imageSrc && (
          <div className="ds-vehicle-card__image">
            <img src={imageSrc} alt={imageAlt ?? name} />
          </div>
        )}

        {infoRows && infoRows.length > 0 && (
          <div className="ds-vehicle-card__info">
            {infoRows.map((row, i) => (
              <div key={i} className="ds-vehicle-card__row">
                {row.icon && <span className="ds-vehicle-card__row-icon">{row.icon}</span>}
                <span className="ds-vehicle-card__row-label">{row.label}</span>
                <span className="ds-vehicle-card__row-value">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {actions && <div className="ds-vehicle-card__footer">{actions}</div>}
      </div>
    );
  },
);

VehicleCard.displayName = "VehicleCard";
