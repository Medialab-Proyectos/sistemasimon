import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — NavBar (Organism)
 *
 * Figma specs:
 *   Height: auto
 *   Padding: 16px horizontal, 8px vertical
 *   Background: white
 *   Border-bottom: 1px neutral-200
 *   Layout: horizontal, space-between
 *   Logo: left
 *   Actions: right (search, notifications, profile)
 *   Size: desktop | mobile
 * ────────────────────────────────────────────── */

export type NavBarSize = "desktop" | "mobile";

export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  size?: NavBarSize;
  logo?: ReactNode;
  actions?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export const NavBar = forwardRef<HTMLElement, NavBarProps>(
  (
    {
      size = "desktop",
      logo,
      actions,
      leftContent,
      rightContent,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        className={`ds-navbar ds-navbar--${size} ${className}`.trim()}
        {...rest}
      >
        <div className="ds-navbar__left">
          {logo && <span className="ds-navbar__logo">{logo}</span>}
          {leftContent}
        </div>
        {children && <div className="ds-navbar__center">{children}</div>}
        <div className="ds-navbar__right">
          {rightContent}
          {actions}
        </div>
      </nav>
    );
  },
);

NavBar.displayName = "NavBar";
