interface PaginationHistoryTableProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  isDark?: boolean;
}

export function PaginationHistoryTable({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  isDark = false,
}: Readonly<PaginationHistoryTableProps>) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const containerBorderClass = isDark ? "border-border-subtle" : "border-[#e0e0e0]";
  const textClass = isDark ? "text-text-muted" : "text-[#888]";
  const buttonDefaultClass = isDark
    ? "border-border-subtle text-text-muted hover:bg-surface"
    : "border-[#e0e0e0] text-[#595959] hover:bg-[#f5f5f5]";
  const buttonActiveClass = isDark
    ? "bg-[#00F1C7] text-[#003833]"
    : "bg-[#00F1C7] text-white";
  const buttonDisabledClass = isDark ? "opacity-40 cursor-not-allowed" : "opacity-40 cursor-not-allowed";

  return (
    <div className={`flex items-center justify-between px-4 py-3 border-t ${containerBorderClass}`}>
      <span className={`text-[14px] font-['Museo_Sans_300',sans-serif] ${textClass}`}>
        Resultados {startItem}–{endItem} de {totalItems}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-[6px] border transition disabled:${buttonDisabledClass} ${buttonDefaultClass}`}
        >
          <svg viewBox="0 0 9 5" fill="none" className="w-3 h-3">
            <path d="M8.5 4.5L4.5 0.5L0.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-[14px] font-['Museo_Sans_500',sans-serif] transition ${
              page === currentPage ? buttonActiveClass : `border ${buttonDefaultClass}`
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-[6px] border transition disabled:${buttonDisabledClass} ${buttonDefaultClass}`}
        >
          <svg viewBox="0 0 9 5" fill="none" className="w-3 h-3">
            <path d="M0.5 0.5L4.5 4.5L8.5 0.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
