import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — TableRow / Column Name (Organism)
 *
 * Figma specs:
 *   Types: header | normal | buttons | status | select
 *   Header: neutral-50 bg, semibold, neutral-900
 *   Normal: white bg (odd) / neutral-50 bg (even)
 *   Text: Body (16px) regular, neutral-900
 *   Border-bottom: 1px neutral-200
 *   Padding: 12px 16px
 *   Checkbox: optional left (select type)
 *   Actions: optional right (buttons type)
 *   Status badge: optional (status type)
 * ────────────────────────────────────────────── */

export type TableRowType = "header" | "normal" | "buttons" | "status" | "select";

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowType?: TableRowType;
  isEven?: boolean;
  selected?: boolean;
  actions?: ReactNode;
  statusBadge?: ReactNode;
  checkbox?: ReactNode;
}

const typeClass: Record<TableRowType, string> = {
  header: "ds-table-row--header",
  normal: "",
  buttons: "ds-table-row--buttons",
  status: "ds-table-row--status",
  select: "ds-table-row--select",
};

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      rowType = "normal",
      isEven = false,
      selected = false,
      actions,
      statusBadge,
      checkbox,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <tr
        ref={ref}
        className={`ds-table-row ${typeClass[rowType]} ${isEven ? "ds-table-row--even" : ""} ${selected ? "ds-table-row--selected" : ""} ${className}`.trim()}
        {...rest}
      >
        {(rowType === "select" || checkbox) && (
          <td className="ds-table-row__check">{checkbox}</td>
        )}
        {children}
        {rowType === "status" && statusBadge && (
          <td className="ds-table-row__status">{statusBadge}</td>
        )}
        {rowType === "buttons" && actions && (
          <td className="ds-table-row__actions">{actions}</td>
        )}
      </tr>
    );
  },
);

TableRow.displayName = "TableRow";
