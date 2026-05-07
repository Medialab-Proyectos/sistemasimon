export type CommandTab = "comandos" | "configuracion" | "historial";

interface CommandTabsProps {
  activeTab: CommandTab;
  onTabChange: (tab: CommandTab) => void;
  isDark?: boolean;
}

const TABS: { id: CommandTab; label: string }[] = [
  { id: "comandos", label: "Comandos" },
  { id: "configuracion", label: "Configuración" },
  { id: "historial", label: "Historial" },
];

export function CommandTabs({ activeTab, onTabChange, isDark = false }: Readonly<CommandTabsProps>) {
  const borderClass = isDark ? "border-border-subtle" : "border-[#e0e0e0]";
  const activeClass = isDark ? "text-[#00F1C7]" : "text-[#00F1C7]";
  const inactiveClass = isDark ? "text-text-muted hover:text-text" : "text-[#888] hover:text-[#1a1a1a]";

  return (
    <div className={`flex items-center gap-0 border-b ${borderClass}`}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-3 text-[16px] font-['Museo_Sans_500',sans-serif] transition-colors ${
            activeTab === tab.id ? activeClass : inactiveClass
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00F1C7] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
