interface CommandActionFooterProps {
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  isDark?: boolean;
}

export function CommandActionFooter({
  onSend,
  disabled,
  loading,
  isDark = false,
}: Readonly<CommandActionFooterProps>) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || loading}
        className={`h-[48px] px-8 rounded-[9999px] font-['Museo_Sans_500',sans-serif] text-[14px] font-bold transition-all ${
          disabled || loading
            ? isDark
              ? "bg-[#333] text-[#666] cursor-not-allowed"
              : "bg-[#e0e0e0] text-[#888] cursor-not-allowed"
            : isDark
              ? "bg-[#00F1C7] text-[#003833] hover:bg-[#00d6b5]"
              : "bg-[#00F1C7] text-white hover:bg-[#00d6b5] shadow-lg shadow-[#00F1C7]/30 hover:-translate-y-[1px]"
        }`}
      >
        {loading ? "Enviando..." : "Enviar comando"}
      </button>
    </div>
  );
}
