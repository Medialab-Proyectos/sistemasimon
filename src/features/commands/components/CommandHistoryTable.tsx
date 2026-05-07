export type CommandStatus = "enviado" | "guardado" | "pendiente" | "no_enviado";

export interface HistoryRow {
  id: number;
  command: string;
  icon?: string;
  method: "GPRS" | "SMS" | "—";
  date: string;
  status: CommandStatus;
}

interface CommandHistoryTableProps {
  rows?: HistoryRow[];
  isDark?: boolean;
}

const STATUS_STYLES: Record<CommandStatus, { bg: string; text: string; bgDark: string; textDark: string }> = {
  enviado: { bg: "#e8f5e9", text: "#2e7d32", bgDark: "#1a3d1a", textDark: "#4caf50" },
  guardado: { bg: "#f1f8e9", text: "#558b2f", bgDark: "#1a2d1a", textDark: "#66bb6a" },
  pendiente: { bg: "#fff3e0", text: "#ef6c00", bgDark: "#2d2a1a", textDark: "#ffa726" },
  no_enviado: { bg: "#ffebee", text: "#c62828", bgDark: "#3d1a1a", textDark: "#ef5350" },
};

export function CommandHistoryTable({ rows = MOCK_HISTORY, isDark = false }: Readonly<CommandHistoryTableProps>) {
  const headerBgClass = isDark ? "bg-surface" : "bg-[#e6f9f7]";
  const headerTextClass = isDark ? "text-text" : "text-[#1a1a1a]";
  const rowHoverClass = isDark ? "hover:bg-surface" : "hover:bg-[#fafafa]";
  const cellTextClass = isDark ? "text-text" : "text-[#595959]";
  const iconBgClass = isDark ? "bg-surface" : "bg-[#f5f5f5]";
  const iconClass = isDark ? "text-text-muted" : "text-[#595959]";

  return (
    <div className="overflow-hidden">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className={`text-left ${headerBgClass}`}>
            <th className={`px-4 py-3 font-semibold font-['Museo_Sans_500',sans-serif] ${headerTextClass}`}>
              Comando
            </th>
            <th className={`px-4 py-3 font-semibold font-['Museo_Sans_500',sans-serif] ${headerTextClass}`}>
              Método
            </th>
            <th className={`px-4 py-3 font-semibold font-['Museo_Sans_500',sans-serif] ${headerTextClass}`}>
              Fecha
            </th>
            <th className={`px-4 py-3 font-semibold font-['Museo_Sans_500',sans-serif] ${headerTextClass}`}>
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const statusStyle = STATUS_STYLES[row.status];
            return (
              <tr
                key={row.id}
                className={`border-t ${isDark ? "border-border-subtle" : "border-[#e0e0e0]"} ${rowHoverClass} transition-colors`}
              >
                <td className={`px-4 py-3 ${cellTextClass}`}>
                  <div className="flex items-center gap-2">
                    <CommandIcon name={row.icon} iconBgClass={iconBgClass} iconClass={iconClass} />
                    <span className={`font-['Museo_Sans_500',sans-serif] ${isDark ? "text-text" : "text-[#1a1a1a]"}`}>
                      {row.command}
                    </span>
                  </div>
                </td>
                <td className={`px-4 py-3 font-['Museo_Sans_300',sans-serif] ${cellTextClass}`}>
                  {row.method}
                </td>
                <td className={`px-4 py-3 font-['Museo_Sans_300',sans-serif] font-mono text-[13px] ${cellTextClass}`}>
                  {row.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-[4px] text-[12px] font-semibold font-['Museo_Sans_500',sans-serif]"
                    style={{
                      backgroundColor: isDark ? statusStyle.bgDark : statusStyle.bg,
                      color: isDark ? statusStyle.textDark : statusStyle.text,
                    }}
                  >
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1).replace("_", " ")}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CommandIcon({ name, iconBgClass, iconClass }: { name?: string; iconBgClass: string; iconClass: string }) {
  const icons: Record<string, React.ReactNode> = {
    localizar: (
      <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 ${iconClass}`}>
        <path d="M8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 1.5C6.07 1.5 4.5 3.07 4.5 5C4.5 8.5 8 13.5 8 13.5C8 13.5 11.5 8.5 11.5 5C11.5 3.07 9.93 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    movilizar: (
      <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 ${iconClass}`}>
        <path d="M13.5 9H10L8 11.5L5.5 9H2.5C2.22 9 2 8.78 2 8.5V5.5C2 5.22 2.22 5 2.5 5H3.5L5.5 2L8 5.5L10.5 2L12.5 5H13.5C13.78 5 14 5.22 14 5.5V8.5C14 8.78 13.78 9 13.5 9Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    inmovilizar: (
      <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 ${iconClass}`}>
        <rect x="3" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 6V4C5.5 2.9 6.4 2 7.5 2H8.5C9.6 2 10.5 2.9 10.5 4V6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  };

  return (
    <div className={`w-7 h-7 rounded-full ${iconBgClass} flex items-center justify-center shrink-0`}>
      {icons[name ?? ""] ?? icons.localizar}
    </div>
  );
}

const MOCK_HISTORY: HistoryRow[] = [
  { id: 1, command: "Localizar", icon: "localizar", method: "GPRS", date: "25/01/2026 14:30:00", status: "enviado" },
  { id: 2, command: "Movilizar", icon: "movilizar", method: "SMS", date: "25/01/2026 12:15:00", status: "guardado" },
  { id: 3, command: "Reducir Velocidad", icon: "localizar", method: "GPRS", date: "24/01/2026 09:00:00", status: "pendiente" },
  { id: 4, command: "Inmovilizar", icon: "inmovilizar", method: "—", date: "23/01/2026 18:45:00", status: "no_enviado" },
  { id: 5, command: "Get IO", icon: "localizar", method: "GPRS", date: "23/01/2026 16:20:00", status: "enviado" },
  { id: 6, command: "Set Digital Output", icon: "localizar", method: "SMS", date: "22/01/2026 11:30:00", status: "enviado" },
  { id: 7, command: "Corte de Motor", icon: "inmovilizar", method: "GPRS", date: "22/01/2026 08:00:00", status: "guardado" },
  { id: 8, command: "Restaurar Motor", icon: "movilizar", method: "SMS", date: "21/01/2026 17:00:00", status: "pendiente" },
  { id: 9, command: "Comando Personalizado", icon: "localizar", method: "GPRS", date: "21/01/2026 10:00:00", status: "enviado" },
  { id: 10, command: "Localizar", icon: "localizar", method: "GPRS", date: "20/01/2026 15:30:00", status: "enviado" },
];
