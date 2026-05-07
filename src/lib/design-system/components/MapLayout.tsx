import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — MapLayout (Template)
 *
 * Map view template: map area + side panel with cards.
 * Use inside AppShell content area.
 * ────────────────────────────────────────────── */

export interface MapLayoutProps extends HTMLAttributes<HTMLDivElement> {
  map?: ReactNode;
  cards?: ReactNode;
  actions?: ReactNode;
}

export const MapLayout = forwardRef<HTMLDivElement, MapLayoutProps>(
  ({ map, cards, actions, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={`ds-map-layout ${className}`.trim()} {...rest}>
        <div className="ds-map-layout__map">{map}</div>
        <div className="ds-map-layout__panel">
          <div className="ds-map-layout__cards">{cards}</div>
          {actions && <div className="ds-map-layout__actions">{actions}</div>}
        </div>
      </div>
    );
  },
);

MapLayout.displayName = "MapLayout";
