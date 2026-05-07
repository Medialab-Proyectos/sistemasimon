import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — DropdownItem (Molecule)
 *
 * Figma specs:
 *   Padding: 16px horizontal, 8px vertical
 *   Gap: 8px
 *   Border bottom: 1px neutral-200
 *   States: enable (white) | hover (brand-50) |
 *           selected (brand-400) | disabled (neutral-100)
 *   Text: Body (16px) regular
 *   Subtext: Body S (12px) regular, neutral-400
 *   Checkbox: 20x20 optional
 *   Icon: 16x16 optional
 * ────────────────────────────────────────────── */

export type DropdownItemState = "enable" | "hover" | "selected" | "disabled";

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  state?: DropdownItemState;
  text?: string;
  subText?: string;
  showCheckbox?: boolean;
  checked?: boolean;
  icon?: ReactNode;
}

const stateClass: Record<DropdownItemState, string> = {
  enable: "",
  hover: "ds-dropdown-item--hover",
  selected: "ds-dropdown-item--selected",
  disabled: "ds-dropdown-item--disabled",
};

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    {
      state = "enable",
      text = "List Item",
      subText,
      showCheckbox = false,
      checked = false,
      icon,
      className = "",
      onClick,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-dropdown-item ${stateClass[state]} ${className}`.trim()}
        role="option"
        aria-selected={state === "selected"}
        aria-disabled={state === "disabled"}
        onClick={state !== "disabled" ? onClick : undefined}
        {...rest}
      >
        {showCheckbox && (
          <span className={`ds-dropdown-item__check ${checked || state === "selected" ? "ds-dropdown-item__check--checked" : ""}`}>
            <span className="ds-dropdown-item__check-box" />
          </span>
        )}
        {icon && <span className="ds-dropdown-item__icon">{icon}</span>}
        <div className="ds-dropdown-item__text">
          <span className="ds-dropdown-item__label">{text}</span>
          {subText && (
            <span className="ds-dropdown-item__sub">{subText}</span>
          )}
        </div>
      </div>
    );
  },
);

DropdownItem.displayName = "DropdownItem";
