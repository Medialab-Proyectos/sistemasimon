import { useState } from "react";

interface DeviceSearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  isDark?: boolean;
}

export function DeviceSearchBar({ onSearch, loading, isDark = false }: Readonly<DeviceSearchBarProps>) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const labelClass = isDark ? "text-text-muted" : "text-[#888]";
  const inputClass = isDark
    ? "bg-surface border-border-subtle text-text placeholder:text-text-muted focus:border-[var(--color-primary)]"
    : "bg-white border-[#e0e0e0] text-[#1a1a1a] placeholder:text-[#888] focus:border-[var(--color-primary)]";
  const buttonClass = isDark
    ? "bg-[var(--color-primary)] text-[color:var(--color-primary-foreground)] disabled:bg-[#333] disabled:text-[#666]"
    : "bg-[#00F1C7] text-white disabled:bg-[#e0e0e0] disabled:text-[#888]";

  return (
    <div className={`rounded-[10px] p-4 flex flex-col gap-3 ${isDark ? "bg-surface-elevated border border-border-subtle" : "bg-white border border-[#e0e0e0]"}`}>
      <label className={`text-[16px] font-['Museo_Sans_300',sans-serif] ${labelClass}`}>
        Buscar por placa, IMEI o ICCID
      </label>
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className={`w-full h-[44px] rounded-[8px] border px-4 pr-10 text-[16px] outline-none transition ${inputClass}`}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className={`w-5 h-5 border-2 ${isDark ? "border-border-subtle" : "border-[#e0e0e0]"} border-t-[var(--color-primary)] rounded-full animate-spin`} />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className={`h-[44px] px-6 rounded-[9999px] font-['Museo_Sans_500',sans-serif] text-[14px] font-semibold hover:opacity-90 transition whitespace-nowrap ${buttonClass}`}
        >
          Aplicar
        </button>
      </form>
    </div>
  );
}
