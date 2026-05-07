import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Select (Organism)
 *
 * Figma specs:
 *   Width: flexible (424px reference)
 *   Gap: 8px between label, input, support
 *   Label: Body L (20px) regular + required asterisk
 *   Input: 8px/16px padding, radius-sm (8px), 1px border
 *   Text: Body L (20px) regular
 *   Support: Body (16px) regular, neutral-400
 *   States:
 *     enable: neutral-200 border, neutral-400 placeholder
 *     completed: neutral-200 border, neutral-900 text
 *     error: error-500 border, error-800 support text
 *     success: success-500 border, success-800 support text
 *     disabled: neutral-200 bg+border, neutral-400 text
 *   Pressed: focus ring (4px brand-50 / error-50 / success-50 shadow)
 * ────────────────────────────────────────────── */

export type SelectState = "enable" | "completed" | "error" | "success" | "disabled";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  state?: SelectState;
  label?: string;
  required?: boolean;
  supportText?: string;
  placeholder?: string;
  value?: string;
  options?: SelectOption[];
  showInfoIcon?: boolean;
  showSupportIcon?: boolean;
  onChange?: (value: string) => void;
  renderDropdown?: ReactNode;
}

const stateClass: Record<SelectState, string> = {
  enable: "",
  completed: "ds-select--completed",
  error: "ds-select--error",
  success: "ds-select--success",
  disabled: "ds-select--disabled",
};

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      state = "enable",
      label,
      required = false,
      supportText,
      placeholder = "Text",
      value,
      options = [],
      showInfoIcon = false,
      showSupportIcon = true,
      onChange,
      renderDropdown,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDisabled = state === "disabled";
    const displayText = options.find(o => o.value === value)?.label ?? value ?? placeholder;
    const isPlaceholder = !value;

    const handleToggle = () => {
      if (!isDisabled) setOpen(prev => !prev);
    };

    const handleSelect = (optValue: string) => {
      onChange?.(optValue);
      setOpen(false);
    };

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`ds-select ${stateClass[state]} ${open ? "ds-select--open" : ""} ${className}`.trim()}
        {...rest}
      >
        {label && (
          <div className="ds-select__label-row">
            <span className="ds-select__label">{label}</span>
            {required && <span className="ds-select__required">*</span>}
            {showInfoIcon && (
              <span className="ds-select__info-icon">
                <InfoIcon size={20} />
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          className="ds-select__trigger"
          disabled={isDisabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={handleToggle}
        >
          <span className={`ds-select__value ${isPlaceholder ? "ds-select__value--placeholder" : ""}`}>
            {displayText}
          </span>
          <span className="ds-select__chevron" aria-hidden="true">
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </button>

        {open && !renderDropdown && options.length > 0 && (
          <div className="ds-select__dropdown" role="listbox">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={opt.value === value}
                className={`ds-select__option ${opt.value === value ? "ds-select__option--selected" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {open && renderDropdown}

        {supportText && (
          <div className="ds-select__support">
            {showSupportIcon && (
              <span className="ds-select__support-icon">
                <InfoIcon size={16} />
              </span>
            )}
            <span className="ds-select__support-text">{supportText}</span>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
