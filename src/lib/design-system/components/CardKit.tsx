import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — CardKit (Molecule)
 *
 * Figma specs:
 *   Width: flexible (524px reference)
 *   Padding: 12px
 *   Gap: 8px
 *   Border radius: radius-xs (4px)
 *   Icon container: 56x56, neutral-50 bg (default), success-100 bg (selected)
 *   Icon: 36x36
 *   Title: Body L (20px) bold
 *   Description: Body (16px) regular
 *   Switch: 38x24 toggle
 *   States:
 *     default: white bg, neutral-200 border, gray switch
 *     selected: white bg, brand-400 border, brand shadow, green switch
 * ────────────────────────────────────────────── */

export interface CardKitProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
  selected?: boolean;
  icon?: ReactNode;
  title?: string;
  description?: string;
  showIcon?: boolean;
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  onToggle?: (selected: boolean) => void;
  onSelectedChange?: (selected: boolean) => void;
}

export const CardKit = forwardRef<HTMLDivElement, CardKitProps>(
  (
    {
      selected = false,
      icon,
      title,
      description,
      showIcon = true,
      showInput = false,
      inputLabel,
      inputPlaceholder = "Text",
      onToggle,
      onSelectedChange,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-card-kit ${selected ? "ds-card-kit--selected" : ""} ${className}`.trim()}
        {...rest}
      >
        <div className="ds-card-kit__row">
          {showIcon && (
            <span className="ds-card-kit__icon-wrap">
              {icon ?? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ds-card-kit__icon-svg"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <circle cx="8" cy="10" r="2" />
                  <path d="M8 14h.01M12 10h6M12 14h6" />
                </svg>
              )}
            </span>
          )}
          <div className="ds-card-kit__text">
            {title && <span className="ds-card-kit__title">{title}</span>}
            {description && (
              <span className="ds-card-kit__desc">{description}</span>
            )}
          </div>
          <button
            type="button"
            className={`ds-card-kit__switch ${selected ? "ds-card-kit__switch--on" : ""}`}
            role="switch"
            aria-checked={selected}
            onClick={() => {
              onToggle?.(!selected);
              onSelectedChange?.(!selected);
            }}
          >
            <span className="ds-card-kit__switch-thumb" />
          </button>
        </div>

        {selected && showInput && (
          <div className="ds-card-kit__input-wrap">
            {inputLabel && (
              <label className="ds-card-kit__input-label">
                {inputLabel}
                <span className="ds-card-kit__input-required">*</span>
              </label>
            )}
            <div className="ds-card-kit__input-box">
              <input
                type="text"
                className="ds-card-kit__input"
                placeholder={inputPlaceholder}
              />
            </div>
          </div>
        )}

        {children}
      </div>
    );
  },
);

CardKit.displayName = "CardKit";
