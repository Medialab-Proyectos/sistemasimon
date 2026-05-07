import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — NavBottom (Organism)
 *
 * Figma specs:
 *   Mobile bottom tab bar, 4–5 items
 *   Each item: icon (24px) + label (Body SM)
 *   Active: brand-400, Inactive: neutral-400
 *   Height: 64px, white bg, border-top neutral-200
 *   Optional notification badge on icon
 * ────────────────────────────────────────────── */

export interface NavBottomItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | string;
}

export interface NavBottomProps extends HTMLAttributes<HTMLElement> {
  items: NavBottomItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

export const NavBottom = forwardRef<HTMLElement, NavBottomProps>(
  (
    {
      items,
      activeId,
      onItemClick,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <nav ref={ref} className={`ds-nav-bottom ${className}`.trim()} {...rest}>
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            className={`ds-nav-bottom__item ${item.id === activeId ? "ds-nav-bottom__item--active" : ""}`}
            onClick={() => onItemClick?.(item.id)}
          >
            <span className="ds-nav-bottom__icon-wrap">
              <span className="ds-nav-bottom__icon">{item.icon}</span>
              {item.badge != null && (
                <span className="ds-nav-bottom__badge">{item.badge}</span>
              )}
            </span>
            <span className="ds-nav-bottom__label">{item.label}</span>
          </button>
        ))}
      </nav>
    );
  },
);

NavBottom.displayName = "NavBottom";
