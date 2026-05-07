import { useState } from "react";

export interface CommandIcon {
  id: string;
  name: string;
  viewBox: string;
  path: string;
}

export const COMMAND_ICONS: CommandIcon[] = [
  { id: "car", name: "Car", viewBox: "0 0 24 24", path: "M5 17H4C3.4 17 3 16.6 3 16V8C3 7.4 3.4 7 4 7H20C20.6 7 21 7.4 21 8V16C21 16.6 20.6 17 20 17M5 17L6.5 13.5L10 17H14L17.5 13.5L19 17M7 9L9 11M15 11L17 9" },
  { id: "speedometer", name: "Speedometer", viewBox: "0 0 24 24", path: "M12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16M12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10M3 12C3 7 7 3 12 3C17 3 21 7 21 12M19.4 16.6L17.8 18.2L16.3 16.7L17.9 15.1" },
  { id: "wifi", name: "WiFi", viewBox: "0 0 24 24", path: "M5 12.55C5.5 11.8 6.3 11.2 7.2 11M12 20.5C12 20.5 12 20.5 12 20.5M18.8 11.2C18.4 11.2 18 11.2 17.5 11.2M12 3C7 3 2.8 6.5 2 11M12 8C15.3 8 18 10.7 18 14" },
  { id: "parking", name: "Parking", viewBox: "0 0 24 24", path: "M3 3H14C17.9 3 21 6.1 21 10V14C21 17.9 17.9 21 14 21H3V3M3 8H13M9 12V17" },
  { id: "noentry", name: "No Entry", viewBox: "0 0 24 24", path: "M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M15.5 8L8.5 16" },
  { id: "jack", name: "Car Jack", viewBox: "0 0 24 24", path: "M4 17H20M6 17V11H18V17M8 7L6 3H18L16 7M12 7V3M9 11H15" },
  { id: "fuel", name: "Fuel", viewBox: "0 0 24 24", path: "M3 22V6C3 5.4 3.4 5 4 5H14C14.6 5 15 5.4 15 6V22M3 22H15M3 22H21M8 8H12M6 11H14M9 14H11" },
  { id: "cone", name: "Traffic Cone", viewBox: "0 0 24 24", path: "M4 21L5.5 14H18.5L20 21H4M4 21H20M9 14L12 5L15 14M7 10H17" },
  { id: "barrier", name: "Barrier", viewBox: "0 0 24 24", path: "M4 15H20V17H4V15M4 11H20V13H4V11M6 7H18V9H6V7M2 19H22V21H2V19" },
  { id: "back", name: "Back", viewBox: "0 0 24 24", path: "M9 18L4 12L9 6M4 12H20" },
  { id: "forward", name: "Forward", viewBox: "0 0 24 24", path: "M15 18L20 12L15 6M20 12H4" },
  { id: "custom", name: "Custom", viewBox: "0 0 24 24", path: "M12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20M12 8V16M8 12H16" },
];

interface IconPickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  isDark?: boolean;
}

export function IconPicker({ selectedId, onSelect, isDark = false }: Readonly<IconPickerProps>) {
  const containerClass = isDark ? "bg-surface border-border-subtle" : "bg-white border-[#e0e0e0]";
  const selectedClass = isDark ? "bg-[#00f1c7]/20 ring-[#00F1C7]" : "bg-[#00f1c7]/20 ring-[#00F1C7]";
  const unselectedClass = isDark ? "bg-surface hover:bg-[#333]" : "bg-[#f5f5f5] hover:bg-[#e8e8e8]";
  const iconClass = isDark ? "text-text-muted" : "text-[#595959]";

  return (
    <div className={`grid grid-cols-6 gap-2 p-3 rounded-[10px] border ${containerClass}`}>
      {COMMAND_ICONS.map((icon) => (
        <button
          key={icon.id}
          type="button"
          onClick={() => onSelect(icon.id)}
          className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all ${selectedId === icon.id ? selectedClass : unselectedClass}`}
          title={icon.name}
        >
          <svg viewBox={icon.viewBox} fill="none" className={`w-5 h-5 ${iconClass}`}>
            <path d={icon.path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}

interface CreateCommandFormProps {
  onCancel?: () => void;
  onSave?: (data: { name: string; description: string; iconId: string }) => void;
  isDark?: boolean;
}

export function CreateCommandForm({ onCancel, onSave, isDark = false }: Readonly<CreateCommandFormProps>) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconId, setIconId] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const isValid = name.trim().length > 0 && iconId !== null;

  const handleSave = () => {
    if (!isValid) return;
    onSave?.({ name: name.trim(), description: description.trim(), iconId: iconId! });
  };

  const selectedIcon = COMMAND_ICONS.find((i) => i.id === iconId);

  const containerClass = isDark ? "bg-surface-elevated" : "bg-white";
  const titleClass = isDark ? "text-text" : "text-[#1a1a1a]";
  const subtitleClass = isDark ? "text-text-muted" : "text-[#595959]";
  const labelClass = isDark ? "text-text" : "text-[#1a1a1a]";
  const inputClass = isDark
    ? "bg-surface border-border-subtle text-text placeholder:text-text-muted focus:border-[var(--color-primary)]"
    : "bg-white border-[#e0e0e0] text-[#1a1a1a] placeholder:text-[#888] focus:border-[var(--color-primary)]";
  const cancelClass = isDark ? "text-[#00F1C7] hover:text-[#00d6b5]" : "text-[#007868] hover:text-[#005f54]";
  const createEnabledClass = isDark
    ? "bg-[#00F1C7] text-[#003833] hover:bg-[#00d6b5]"
    : "bg-[#00F1C7] text-white hover:bg-[#00d6b5]";
  const createDisabledClass = isDark ? "bg-[#333] text-[#666] cursor-not-allowed" : "bg-[#e0e0e0] text-[#888] cursor-not-allowed";

  return (
    <div className={`rounded-[10px] p-6 flex flex-col gap-5 ${containerClass}`}>
      <button
        type="button"
        onClick={onCancel}
        className={`flex items-center gap-2 transition self-start ${cancelClass}`}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[14px] font-['Museo_Sans_300',sans-serif]">Volver</span>
      </button>

      <div className="flex flex-col gap-1">
        <h2 className={`text-[18px] font-bold font-['Museo_Sans_700',sans-serif] ${titleClass}`}>
          Crear comando
        </h2>
        <p className={`text-[14px] font-['Museo_Sans_300',sans-serif] leading-relaxed ${subtitleClass}`}>
          Por favor completa todos los datos del formulario. Recuerda, que todos los elementos
          marcados con * son obligatorios y hasta no completarse no se habilitará el botón de crear.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className={`text-[14px] font-semibold font-['Museo_Sans_500',sans-serif] ${labelClass}`}>
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ejemplo: Reducir velocidad"
            className={`h-[44px] rounded-[8px] border px-3 text-[14px] outline-none transition ${inputClass}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={`text-[14px] font-semibold font-['Museo_Sans_500',sans-serif] ${labelClass}`}>
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingresa la información"
            className={`h-[44px] rounded-[8px] border px-3 text-[14px] outline-none transition ${inputClass}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={`text-[14px] font-semibold font-['Museo_Sans_500',sans-serif] ${labelClass}`}>
            Icono comando <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIconPicker((v) => !v)}
              className={`w-full h-[44px] rounded-[8px] border px-3 flex items-center justify-between text-[14px] transition ${
                isDark ? "border-[#00F1C7] bg-surface text-text hover:bg-[#00f1c7]/5" : "border-[#00F1C7] bg-white text-[#1a1a1a] hover:bg-[#00f1c7]/5"
              }`}
            >
              <span className={selectedIcon ? "flex items-center gap-2" : isDark ? "text-text-muted" : "text-[#888]"}>
                {selectedIcon ? (
                  <>
                    <svg viewBox={selectedIcon.viewBox} fill="none" className={`w-5 h-5 ${isDark ? "text-text-muted" : "text-[#595959]"}`}>
                      <path d={selectedIcon.path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {selectedIcon.name}
                  </>
                ) : (
                  "Selecciona el Icono"
                )}
              </span>
              <svg viewBox="0 0 12 8" fill="none" className={`w-3 h-3 ${isDark ? "text-text-muted" : "text-[#888]"}`}>
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showIconPicker && (
              <div className="absolute top-full left-0 right-0 z-10 mt-2">
                <IconPicker selectedId={iconId} onSelect={(id) => { setIconId(id); setShowIconPicker(false); }} isDark={isDark} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={`h-[44px] px-6 text-[14px] font-semibold font-['Museo_Sans_500',sans-serif] transition ${cancelClass}`}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid}
          className={`h-[44px] px-8 rounded-[9999px] text-[14px] font-bold font-['Museo_Sans_500',sans-serif] transition-all ${isValid ? createEnabledClass : createDisabledClass}`}
        >
          Crear
        </button>
      </div>
    </div>
  );
}
