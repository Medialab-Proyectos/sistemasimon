import { forwardRef, type InputHTMLAttributes } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Checkbox (Atom)
 *
 * Figma specs:
 *   Size: 20x20px
 *   Border radius: 4px (radius-xs)
 *   Unchecked: 2px neutral-200 border
 *   Checked: brand-400 fill with white checkmark
 *   States: default | hover | disabled | indeterminate
 * ────────────────────────────────────────────── */

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", indeterminate, disabled, ...rest }, ref) => {
    return (
      <label
        className={`ds-checkbox ${disabled ? "ds-checkbox--disabled" : ""} ${className}`.trim()}
      >
        <span className="ds-checkbox__box">
          <input
            ref={(el) => {
              if (el) el.indeterminate = indeterminate ?? false;
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            type="checkbox"
            className="ds-checkbox__input"
            disabled={disabled}
            {...rest}
          />
          <svg
            className="ds-checkbox__check"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="ds-checkbox__indeterminate"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 8H12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {label && <span className="ds-checkbox__label">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
