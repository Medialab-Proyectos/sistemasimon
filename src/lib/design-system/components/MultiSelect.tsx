import { forwardRef, useState, useRef, useEffect, type HTMLAttributes } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — MultiSelect (Organism)
 *
 * Figma specs:
 *   States: enable, completed, error, success, disabled
 *   Trigger: shows comma-separated selected labels (truncated)
 *   Dropdown: checkbox + label per option
 *   Checkbox: 20×20 brand-400 bg, 2px radius, white check
 *   Label row: label + required asterisk
 *   Support text: below trigger
 * ────────────────────────────────────────────── */

export type MultiSelectState = "enable" | "completed" | "error" | "success" | "disabled";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  state?: MultiSelectState;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options?: MultiSelectOption[];
  value?: string[];
  supportText?: string;
  onChange?: (values: string[]) => void;
}

const stateClass: Record<MultiSelectState, string> = {
  enable: "",
  completed: "ds-multi-select--completed",
  error: "ds-multi-select--error",
  success: "ds-multi-select--success",
  disabled: "ds-multi-select--disabled",
};

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      state = "enable",
      label,
      required = false,
      placeholder = "Seleccionar",
      options = [],
      value = [],
      supportText,
      onChange,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDisabled = state === "disabled";

    const handleToggle = () => {
      if (!isDisabled) setOpen(prev => !prev);
    };

    const handleOptionClick = (optValue: string) => {
      const next = value.includes(optValue)
        ? value.filter(v => v !== optValue)
        : [...value, optValue];
      onChange?.(next);
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

    const selectedLabels = value
      .map(v => options.find(o => o.value === v))
      .filter(Boolean) as MultiSelectOption[];

    const displayText = selectedLabels.length > 0
      ? selectedLabels.map(o => o.label).join(" , ")
      : "";

    return (
      <div
        ref={ref}
        className={`ds-multi-select ${stateClass[state]} ${open ? "ds-multi-select--open" : ""} ${className}`.trim()}
        {...rest}
      >
        {label && (
          <div className="ds-multi-select__label-row">
            <span className="ds-multi-select__label">{label}</span>
            {required && <span className="ds-multi-select__required">*</span>}
          </div>
        )}

        <div ref={containerRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="ds-multi-select__trigger"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={handleToggle}
            disabled={isDisabled}
          >
            {selectedLabels.length === 0 ? (
              <span className="ds-multi-select__placeholder">{placeholder}</span>
            ) : (
              <span className="ds-multi-select__value">{displayText}</span>
            )}
            <span className="ds-multi-select__chevron" aria-hidden="true">
              {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </span>
          </button>

          {open && options.length > 0 && (
            <div className="ds-multi-select__dropdown" role="listbox" aria-multiselectable="true">
              {options.map(opt => {
                const isSelected = value.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`ds-multi-select__option ${isSelected ? "ds-multi-select__option--selected" : ""}`}
                    onClick={() => handleOptionClick(opt.value)}
                  >
                    <span className={`ds-multi-select__checkbox ${isSelected ? "ds-multi-select__checkbox--checked" : ""}`}>
                      {isSelected && <CheckIcon />}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {supportText && (
          <div className="ds-multi-select__support">
            <span>{supportText}</span>
          </div>
        )}
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

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

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
