import {
  forwardRef,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  rowClassName?: (row: T) => string;
  emptyState?: ReactNode;
  emptyColSpan?: number;
}

function DataTableInner<T>(
  {
    columns,
    rows,
    getRowKey,
    rowClassName,
    emptyState = "No hay registros disponibles",
    emptyColSpan,
    className = "",
    ...rest
  }: DataTableProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={`ds-data-table ${className}`.trim()} {...rest}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={getRowKey(row)} className={rowClassName?.(row)}>
                {columns.map((column) => (
                  <td key={column.id}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="ds-data-table__empty" colSpan={emptyColSpan ?? columns.length}>
                {emptyState}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactElement;
