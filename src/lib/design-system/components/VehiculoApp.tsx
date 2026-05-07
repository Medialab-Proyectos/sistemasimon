import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — VehiculoApp (Organism / Domain)
 *
 * Mobile-first vehicle list item card.
 * Image + name + plate + status dot + chevron/actions.
 * ────────────────────────────────────────────── */

export type VehiculoAppStatus = "available" | "in-use" | "offline" | "alert";

export interface VehiculoAppProps extends HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  imageAlt?: string;
  name: string;
  plate?: string;
  status?: VehiculoAppStatus;
  statusText?: string;
  selected?: boolean;
  showChevron?: boolean;
  rightContent?: ReactNode;
}

export const VehiculoApp = forwardRef<HTMLDivElement, VehiculoAppProps>(
  (
    {
      imageSrc,
      imageAlt,
      name,
      plate,
      status,
      statusText,
      selected = false,
      showChevron = true,
      rightContent,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-vehiculo-app ${selected ? "ds-vehiculo-app--selected" : ""} ${className}`.trim()}
        {...rest}
      >
        <div className="ds-vehiculo-app__image">
          {imageSrc ? (
            <img src={imageSrc} alt={imageAlt ?? name} />
          ) : (
            <CarIcon />
          )}
        </div>

        <div className="ds-vehiculo-app__body">
          <span className="ds-vehiculo-app__name">{name}</span>
          {plate && <span className="ds-vehiculo-app__plate">{plate}</span>}
          {status && (
            <span className={`ds-vehiculo-app__status ds-vehiculo-app__status--${status}`}>
              <span className="ds-vehiculo-app__status-dot" />
              {statusText}
            </span>
          )}
        </div>

        <div className="ds-vehiculo-app__right">
          {rightContent}
          {showChevron && (
            <span className="ds-vehiculo-app__chevron">
              <ChevronRightIcon />
            </span>
          )}
        </div>
      </div>
    );
  },
);

VehiculoApp.displayName = "VehiculoApp";

function CarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17v2m14-2v2" />
      <circle cx="7.5" cy="14" r="1.5" /><circle cx="16.5" cy="14" r="1.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
