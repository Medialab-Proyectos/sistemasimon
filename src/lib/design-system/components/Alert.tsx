import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Alert (Organism)
 *
 * Figma specs:
 *   Padding: 16px
 *   Gap: 12px
 *   Border: 2px solid
 *   Border radius: radius-sm (8px)
 *   Colors:
 *     principal: brand-50 bg, brand-400 border, brand-800 title
 *     error: error-50 bg, error-500 border, error-800 title
 *     warning: warning-50 bg, warning-500 border, warning-700 title
 *     success: success-50 bg, success-500 border, success-800 title
 *     neutral: neutral-50 bg, neutral-300 border, neutral-900 title
 *   Title: H6 (20px) semibold
 *   Body: Body (16px) regular
 *   Icons: 24px left / right (Lucide)
 *   CTA: ghost button
 * ────────────────────────────────────────────── */

export type AlertColor = "principal" | "error" | "warning" | "success" | "neutral";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  color?: AlertColor;
  title?: string;
  description?: string;
  leftIcon?: ReactNode;
  showLeftIcon?: boolean;
  showCloseIcon?: boolean;
  ctaLabel?: string;
  onClose?: () => void;
  onCtaClick?: () => void;
}

const colorClass: Record<AlertColor, string> = {
  principal: "ds-alert--principal",
  error: "ds-alert--error",
  warning: "ds-alert--warning",
  success: "ds-alert--success",
  neutral: "ds-alert--neutral",
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      color = "principal",
      title,
      description,
      leftIcon,
      showLeftIcon = true,
      showCloseIcon = true,
      ctaLabel,
      onClose,
      onCtaClick,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={`ds-alert ${colorClass[color]} ${className}`.trim()}
        {...rest}
      >
        <div className="ds-alert__body">
          <div className="ds-alert__header">
            {showLeftIcon && (
              <span className="ds-alert__icon">
                {leftIcon ?? <PlusIcon />}
              </span>
            )}
            {title && <span className="ds-alert__title">{title}</span>}
            {showCloseIcon && (
              <button
                type="button"
                className="ds-alert__close"
                aria-label="Cerrar"
                onClick={onClose}
              >
                <XIcon />
              </button>
            )}
          </div>

          {description && <p className="ds-alert__desc">{description}</p>}
          {children}

          {ctaLabel && (
            <button
              type="button"
              className="ds-alert__cta"
              onClick={onCtaClick}
            >
              <PlusIcon size={16} />
              <span>{ctaLabel}</span>
              <PlusIcon size={16} />
            </button>
          )}
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";

function PlusIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
