import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Tab (Molecule)
 *
 * Figma specs:
 *   Height: 44px
 *   Padding: 16px vertical, 20px horizontal
 *   Gap: 8px
 *   Icon: 12x12px (Lucide)
 *   Text: Body (16px)
 *   States:
 *     enable: pill, white bg, neutral-400 text regular
 *     hover: pill, brand-50 bg, brand-800 text
 *     pressed: pill, white bg, 4px brand-100 border
 *     selected: flat bottom, white bg, 2px brand-600 bottom border, brand-800 semibold
 *     disabled: pill, neutral-100 bg, neutral-400 text
 * ────────────────────────────────────────────── */

export type TabState = "enable" | "hover" | "pressed" | "selected" | "disabled";

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tabState?: TabState;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const stateClass: Record<TabState, string> = {
  enable: "",
  hover: "ds-tab--hover",
  pressed: "ds-tab--pressed",
  selected: "ds-tab--selected",
  disabled: "ds-tab--disabled",
};

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      tabState = "enable",
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...rest
    },
    ref,
  ) => {
    const resolvedState = disabled ? "disabled" : tabState;

    return (
      <button
        ref={ref}
        className={`ds-tab ${stateClass[resolvedState]} ${className}`.trim()}
        role="tab"
        aria-selected={resolvedState === "selected"}
        aria-disabled={resolvedState === "disabled"}
        disabled={disabled}
        {...rest}
      >
        {leftIcon && <span className="ds-tab__icon">{leftIcon}</span>}
        {children && <span className="ds-tab__label">{children}</span>}
        {rightIcon && <span className="ds-tab__icon">{rightIcon}</span>}
      </button>
    );
  },
);

Tab.displayName = "Tab";
