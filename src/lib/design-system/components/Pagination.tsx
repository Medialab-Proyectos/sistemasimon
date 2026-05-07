import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Pagination (Organism)
 *
 * Figma specs:
 *   Items: 40x40, radius-sm (8px)
 *   States per item:
 *     enable: white bg, neutral-400 text
 *     hover: brand-50 bg, brand-800 text
 *     selected: brand-400 bg, brand-950 text
 *     disabled: neutral-100 bg, neutral-400 text
 *   Arrows: chevron-left / chevron-right
 *   Gap: 8px
 * ────────────────────────────────────────────── */

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      prevIcon,
      nextIcon,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const pages = buildPages(currentPage, totalPages);

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={`ds-pagination ${className}`.trim()}
        {...rest}
      >
        <button
          type="button"
          className="ds-pagination__item ds-pagination__arrow"
          disabled={currentPage <= 1}
          aria-label="Previous page"
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          {prevIcon ?? <ChevronLeftIcon />}
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="ds-pagination__ellipsis">...</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`ds-pagination__item ${p === currentPage ? "ds-pagination__item--selected" : ""}`}
              aria-current={p === currentPage ? "page" : undefined}
              onClick={() => onPageChange?.(p as number)}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          className="ds-pagination__item ds-pagination__arrow"
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          {nextIcon ?? <ChevronRightIcon />}
        </button>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
