import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — CarCard (Organism / Domain)
 *
 * Covers CAR_CARD and Carro from Figma.
 * Vehicle summary card: image + status dot + name + details + actions.
 * ────────────────────────────────────────────── */

export type CarStatus = "available" | "in-use" | "maintenance" | "offline";

export interface CarCardDetail {
  label: string;
  value: string;
}

export interface CarCardProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  imageAlt?: string;
  name: string;
  status?: CarStatus;
  details?: CarCardDetail[];
  selected?: boolean;
  footer?: ReactNode;
}

export const CarCard = forwardRef<HTMLDivElement, CarCardProps>(
  (
    {
      imageSrc,
      imageAlt,
      name,
      status,
      details,
      selected = false,
      footer,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-car-card ${selected ? "ds-car-card--selected" : ""} ${className}`.trim()}
        {...rest}
      >
        <div className="ds-car-card__image">
          {imageSrc && <img src={imageSrc} alt={imageAlt ?? name} />}
          {status && (
            <span className={`ds-car-card__status-dot ds-car-card__status-dot--${status}`} />
          )}
        </div>

        <div className="ds-car-card__body">
          <span className="ds-car-card__name">{name}</span>
          {details && details.length > 0 && (
            <div className="ds-car-card__details">
              {details.map((d, i) => (
                <div key={i} className="ds-car-card__detail">
                  <span className="ds-car-card__detail-label">{d.label}</span>
                  <span className="ds-car-card__detail-value">{d.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {footer && <div className="ds-car-card__footer">{footer}</div>}
      </div>
    );
  },
);

CarCard.displayName = "CarCard";
