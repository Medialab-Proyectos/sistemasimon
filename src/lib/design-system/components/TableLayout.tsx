import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — TableLayout (Template)
 *
 * Table page template: header with title/search/filters,
 * optional tabs, table body, footer with pagination.
 * Use inside AppShell content area.
 * ────────────────────────────────────────────── */

export interface TableLayoutProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  search?: ReactNode;
  filters?: ReactNode;
  headerActions?: ReactNode;
  tabs?: ReactNode;
  footer?: ReactNode;
  rowCount?: string;
  pagination?: ReactNode;
}

export const TableLayout = forwardRef<HTMLDivElement, TableLayoutProps>(
  (
    {
      title,
      search,
      filters,
      headerActions,
      tabs,
      footer,
      rowCount,
      pagination,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`ds-table-layout ${className}`.trim()} {...rest}>
        {/* Header */}
        {(title || search || filters || headerActions) && (
          <div className="ds-table-layout__header">
            {title && <span className="ds-table-layout__title">{title}</span>}
            {search && <div className="ds-table-layout__search">{search}</div>}
            {filters && <div className="ds-table-layout__filters">{filters}</div>}
            {headerActions && (
              <div className="ds-table-layout__header-actions">{headerActions}</div>
            )}
          </div>
        )}

        {/* Tabs */}
        {tabs && <div className="ds-table-layout__tabs">{tabs}</div>}

        {/* Table body */}
        <div className="ds-table-layout__table">{children}</div>

        {/* Footer */}
        {(footer || rowCount || pagination) && (
          <div className="ds-table-layout__footer">
            {rowCount ? <span className="ds-table-layout__row-count">{rowCount}</span> : <span />}
            {pagination}
            {footer}
          </div>
        )}
      </div>
    );
  },
);

TableLayout.displayName = "TableLayout";
