import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — MenuItem (Molecule)
 *
 * Figma specs:
 *   Width: 220px (flexible)
 *   Padding: 12px
 *   Gap: 8px
 *   Border radius: 8px (radius-sm)
 *   Icon: 20x20px (Lucide icons)
 *   Text: Body (16px) regular
 *   States:
 *     enable: white bg, neutral-400 text
 *     hover: brand-50 bg, neutral-400 text
 *     selected: gradient brand-400 → brand-50, brand-950 text
 * ────────────────────────────────────────────── */

export type MenuItemState = "enable" | "hover" | "selected";

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state?: MenuItemState;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  label: string;
}

const stateClass: Record<MenuItemState, string> = {
  enable: "",
  hover: "ds-menu-item--hover",
  selected: "ds-menu-item--selected",
};

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    { state = "enable", icon, rightIcon, label, className = "", type = "button", disabled, ...rest },
    ref,
  ) => {
    const resolvedState = disabled ? "enable" : state;

    return (
      <button
        ref={ref}
        type={type}
        className={`ds-menu-item ${stateClass[resolvedState]} ${className}`.trim()}
        role="menuitem"
        aria-current={resolvedState === "selected" ? "page" : undefined}
        disabled={disabled}
        {...rest}
      >
        {icon && <span className="ds-menu-item__icon">{icon}</span>}
        <span className="ds-menu-item__label">{label}</span>
        {rightIcon && (
          <span className="ds-menu-item__icon">{rightIcon}</span>
        )}
      </button>
    );
  },
);

MenuItem.displayName = "MenuItem";
