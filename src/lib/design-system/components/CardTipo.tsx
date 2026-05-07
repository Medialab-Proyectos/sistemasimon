import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — CardTipo (Organism / Domain)
 *
 * Generic type/category card used for selection screens.
 * Icon circle + title + description + optional arrow.
 * States: default | selected
 * ────────────────────────────────────────────── */

export interface CardTipoProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  selected?: boolean;
  showArrow?: boolean;
}

export const CardTipo = forwardRef<HTMLDivElement, CardTipoProps>(
  (
    {
      icon,
      title,
      description,
      selected = false,
      showArrow = false,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-card-tipo ${selected ? "ds-card-tipo--selected" : ""} ${className}`.trim()}
        {...rest}
      >
        {icon && <span className="ds-card-tipo__icon">{icon}</span>}
        <div className="ds-card-tipo__body">
          <span className="ds-card-tipo__title">{title}</span>
          {description && <span className="ds-card-tipo__desc">{description}</span>}
        </div>
        {showArrow && (
          <span className="ds-card-tipo__arrow">
            <ChevronRightIcon />
          </span>
        )}
      </div>
    );
  },
);

CardTipo.displayName = "CardTipo";

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
