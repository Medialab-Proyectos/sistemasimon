import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — FormLayout (Template)
 *
 * Form page template: header with back/title/breadcrumb,
 * description, form sections in 2-column grid, footer actions.
 * Use inside AppShell content area.
 * ────────────────────────────────────────────── */

export interface BreadcrumbItem {
  label: string;
  current?: boolean;
}

export interface FormLayoutProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  breadcrumb?: BreadcrumbItem[];
  description?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
}

export const FormLayout = forwardRef<HTMLDivElement, FormLayoutProps>(
  (
    {
      title,
      breadcrumb,
      description,
      headerActions,
      footer,
      onBack,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`ds-form-layout ${className}`.trim()} {...rest}>
        {/* Header */}
        {(onBack || title || breadcrumb) && (
          <div className="ds-form-layout__header">
            {onBack && (
              <button type="button" className="ds-form-layout__back" onClick={onBack} aria-label="Volver">
                <ChevronLeftIcon />
              </button>
            )}
            <div className="ds-form-layout__header-body">
              {title && <span className="ds-form-layout__title">{title}</span>}
              {breadcrumb && breadcrumb.length > 0 && (
                <nav className="ds-form-layout__breadcrumb">
                  {breadcrumb.map((item, i) => (
                    <span key={i}>
                      {i > 0 && <span className="ds-form-layout__breadcrumb-sep"> / </span>}
                      <span className={item.current ? "ds-form-layout__breadcrumb-current" : "ds-form-layout__breadcrumb-item"}>
                        {item.label}
                      </span>
                    </span>
                  ))}
                </nav>
              )}
            </div>
            {headerActions && (
              <div className="ds-form-layout__header-actions">{headerActions}</div>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="ds-form-layout__description">{description}</div>
        )}

        {/* Form body */}
        <div className="ds-form-layout__body">{children}</div>

        {/* Footer */}
        {footer && <div className="ds-form-layout__footer">{footer}</div>}
      </div>
    );
  },
);

FormLayout.displayName = "FormLayout";

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
