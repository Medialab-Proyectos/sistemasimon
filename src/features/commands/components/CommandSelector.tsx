export interface CommandOption {
  id: number;
  label: string;
  icon?: string;
}

interface CommandSelectorProps {
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onCreateNew?: () => void;
  commands?: CommandOption[];
  isDark?: boolean;
}

export function CommandSelector({
  selectedId,
  onSelect,
  onCreateNew,
  commands = MOCK_COMMANDS,
  isDark = false,
}: Readonly<CommandSelectorProps>) {
  const labelClass = isDark ? "text-text-muted" : "text-[#888]";
  const valueClass = isDark ? "text-text" : "text-[#1a1a1a]";
  const selectClass = isDark
    ? "bg-surface border-border-subtle text-text"
    : "bg-white border-[#e0e0e0] text-[#1a1a1a]";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className={`text-[14px] ${labelClass}`}>Comando</span>
          <span className={`text-[14px] ${valueClass}`}>
            Selecciona el comando que quieras enviar al vehículo.
          </span>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <select
          value={selectedId ?? ""}
          onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
          className={`flex-1 h-[44px] rounded-[8px] border px-3 text-[14px] outline-none transition appearance-none cursor-pointer ${selectClass}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "36px",
          }}
        >
          <option value="">Selecciona un comando</option>
          {commands.map((cmd) => (
            <option key={cmd.id} value={cmd.id}>
              {cmd.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onCreateNew}
          className={`h-[44px] px-4 rounded-[9999px] border text-[14px] font-semibold font-['Museo_Sans_500',sans-serif] transition whitespace-nowrap ${
            isDark
              ? "border-[#00F1C7] text-[#00F1C7] hover:bg-[#00F1C7]/10"
              : "border-[#00F1C7] text-[#007868] hover:bg-[#00f1c7]/10"
          }`}
        >
          Crear Nuevo Comando
        </button>
      </div>
    </div>
  );
}

const MOCK_COMMANDS: CommandOption[] = [
  { id: 1, label: "Comando Personalizado" },
  { id: 2, label: "Reducir Velocidad" },
  { id: 3, label: "Get IO" },
  { id: 4, label: "Set Digital Output" },
  { id: 5, label: "Corte de Motor" },
  { id: 6, label: "Restaurar Motor" },
];
