import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — CardInfo (Organism / Domain)
 *
 * Generic info display card with colored top bar,
 * icon, title, value, and description.
 * ────────────────────────────────────────────── */

export type CardInfoColor = "brand" | "success" | "warning" | "error" | "neutral";

export interface CardInfoProps extends HTMLAttributes<HTMLDivElement> {
  color?: CardInfoColor;
  showBar?: boolean;
  icon?: ReactNode;
  title?: string;
  value?: string | number;
  description?: string;
  footer?: ReactNode;
}

const barClass: Record<CardInfoColor, string> = {
  brand: "",
  success: "ds-card-info__bar--success",
  warning: "ds-card-info__bar--warning",
  error: "ds-card-info__bar--error",
  neutral: "ds-card-info__bar--neutral",
};

export const CardInfo = forwardRef<HTMLDivElement, CardInfoProps>(
  (
    {
      color = "brand",
      showBar = true,
      icon,
      title,
      value,
      description,
      footer,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`ds-card-info ${className}`.trim()} {...rest}>
        {showBar && <div className={`ds-card-info__bar ${barClass[color]}`} />}
        <div className="ds-card-info__body">
          {(icon || title) && (
            <div className="ds-card-info__header">
              {icon && <span className="ds-card-info__icon">{icon}</span>}
              {title && <span className="ds-card-info__title">{title}</span>}
            </div>
          )}
          {value != null && <span className="ds-card-info__value">{value}</span>}
          {description && <span className="ds-card-info__desc">{description}</span>}
        </div>
        {footer && <div className="ds-card-info__footer">{footer}</div>}
      </div>
    );
  },
);

CardInfo.displayName = "CardInfo";
