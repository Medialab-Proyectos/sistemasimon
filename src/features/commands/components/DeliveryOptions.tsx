export type DeliveryMethod = "gprs" | "sms";

interface DeliveryOptionsProps {
  selected: DeliveryMethod | null;
  onSelect: (method: DeliveryMethod) => void;
  isDark?: boolean;
}

export function DeliveryOptions({ selected, onSelect, isDark = false }: Readonly<DeliveryOptionsProps>) {
  const titleClass = isDark ? "text-text font-semibold" : "text-[#1a1a1a] font-semibold";
  const subtitleClass = isDark ? "text-text-muted" : "text-[#888]";
  const iconBgClass = isDark ? "bg-surface" : "bg-[#f5f5f5]";
  const iconClass = isDark ? "text-text-muted" : "text-[#595959]";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className={`text-[14px] font-semibold font-['Museo_Sans_500',sans-serif] ${titleClass}`}>
          Opciones de envío
        </span>
        <span className={`text-[14px] ${subtitleClass}`}>
          Selecciona por cuál medio quieres enviar el comando.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelect("gprs")}
          className={`flex items-center gap-3 p-4 rounded-[10px] border-2 transition-all ${
            selected === "gprs"
              ? isDark
                ? "border-[#00F1C7] bg-[#00f1c7]/10"
                : "border-[#00F1C7] bg-[#00f1c7]/5"
              : isDark
                ? "border-border-subtle bg-surface hover:border-[#555]"
                : "border-[#e0e0e0] bg-white hover:border-[#c0c0c0]"
          }`}
        >
          <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center shrink-0`}>
            <svg viewBox="0 0 24 24" fill="none" className={`w-6 h-6 ${iconClass}`}>
              <path
                d="M12 20.5C16.1421 20.5 19.5 17.1421 19.5 13C19.5 8.85786 16.1421 5.5 12 5.5C7.85786 5.5 4.5 8.85786 4.5 13C4.5 17.1421 7.85786 20.5 12 20.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 13L10.5 11L12 12.5L15.5 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className={`text-[16px] font-semibold font-['Museo_Sans_500',sans-serif] ${isDark ? "text-text" : "text-[#1a1a1a]"}`}>
              GPRS / Datos
            </span>
          </div>
          {selected === "gprs" && (
            <div className="ml-auto w-5 h-5 rounded-full border-2 border-[#00F1C7] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F1C7]" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect("sms")}
          className={`flex items-center gap-3 p-4 rounded-[10px] border-2 transition-all ${
            selected === "sms"
              ? isDark
                ? "border-[#00F1C7] bg-[#00f1c7]/10"
                : "border-[#00F1C7] bg-[#00f1c7]/5"
              : isDark
                ? "border-border-subtle bg-surface hover:border-[#555]"
                : "border-[#e0e0e0] bg-white hover:border-[#c0c0c0]"
          }`}
        >
          <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center shrink-0`}>
            <svg viewBox="0 0 24 24" fill="none" className={`w-6 h-6 ${iconClass}`}>
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className={`text-[16px] font-semibold font-['Museo_Sans_500',sans-serif] ${isDark ? "text-text" : "text-[#1a1a1a]"}`}>
              SMS
            </span>
          </div>
          {selected === "sms" && (
            <div className="ml-auto w-5 h-5 rounded-full border-2 border-[#00F1C7] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F1C7]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
