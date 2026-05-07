interface CommandsEmptyStateProps {
  isDark?: boolean;
}

export function CommandsEmptyState({ isDark = false }: Readonly<CommandsEmptyStateProps>) {
  const iconBgClass = isDark ? "bg-surface" : "bg-[#f5f5f5]";
  const iconClass = isDark ? "text-text-muted" : "text-[#c0c0c0]";
  const textClass = isDark ? "text-text-muted" : "text-[#888]";

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center rounded-[10px] ${isDark ? "bg-surface-elevated border border-border-subtle" : "bg-white border border-[#e0e0e0]"}`}>
      <div className={`w-16 h-16 rounded-full ${iconBgClass} flex items-center justify-center mb-4`}>
        <svg viewBox="0 0 24 24" fill="none" className={`w-8 h-8 ${iconClass}`}>
          <path
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className={`text-[16px] font-['Museo_Sans_300',sans-serif] max-w-[280px] leading-relaxed ${textClass}`}>
        Usa los filtros para que te aparezcan las opciones correspondientes
      </p>
    </div>
  );
}
