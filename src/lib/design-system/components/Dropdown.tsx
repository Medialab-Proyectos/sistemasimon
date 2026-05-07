import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Dropdown (Organism)
 *
 * Figma specs:
 *   Container: white bg, 1px neutral-200 border, radius-sm (8px)
 *   Shadow: shadow-sm
 *   Uses DropdownItem molecule for items
 *   Max height: scrollable
 * ────────────────────────────────────────────── */

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      open: controlledOpen,
      onOpenChange,
      trigger,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const toggle = () => {
      const next = !isOpen;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={`ds-dropdown ${isOpen ? "ds-dropdown--open" : ""} ${className}`.trim()}
        {...rest}
      >
        {trigger && (
          <div className="ds-dropdown__trigger" onClick={toggle}>
            {trigger}
          </div>
        )}
        {isOpen && (
          <div className="ds-dropdown__menu" role="listbox">
            {children}
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";
