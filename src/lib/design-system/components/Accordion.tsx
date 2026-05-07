import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Accordion (Molecule)
 *
 * Figma specs:
 *   Border radius: 12px (radius-md)
 *   Header padding: 24px horizontal, 16px vertical
 *   Content padding: 24px, gap 24px
 *   Header text: Body L (20px) semibold
 *   Header icon left: 24px (plus)
 *   Chevron right: 24px (up/down)
 *   States: default (white) | hover (brand-50) | disabled (neutral-100)
 *   Border bottom: 1px neutral-200
 * ────────────────────────────────────────────── */

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  chevronOpen?: ReactNode;
  chevronClosed?: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onToggle,
      onOpenChange,
      disabled = false,
      icon,
      label,
      chevronOpen,
      chevronClosed,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleToggle = () => {
      if (disabled) return;
      const next = !isOpen;
      if (!isControlled) setInternalOpen(next);
      onToggle?.(next);
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={`ds-accordion ${disabled ? "ds-accordion--disabled" : ""} ${className}`.trim()}
        {...rest}
      >
        <button
          type="button"
          className={`ds-accordion__header ${isOpen ? "ds-accordion__header--open" : ""}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
        >
          {icon && <span className="ds-accordion__icon">{icon}</span>}
          <span className="ds-accordion__label">{label}</span>
          <span className="ds-accordion__chevron" aria-hidden="true">
            {isOpen
              ? (chevronOpen ?? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                ))
              : (chevronClosed ?? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                ))}
          </span>
        </button>
        {isOpen && (
          <div className="ds-accordion__content">{children}</div>
        )}
      </div>
    );
  },
);

Accordion.displayName = "Accordion";
