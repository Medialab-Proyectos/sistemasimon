import { useState } from "react";

export interface ConfigParameter {
  id: string;
  label: string;
  value: string;
  unit?: string;
}

interface DeviceConfigurationTabProps {
  parameters?: ConfigParameter[];
  onEdit?: (id: string, value: string) => void;
  isDark?: boolean;
}

export function DeviceConfigurationTab({
  parameters = MOCK_PARAMS,
  onEdit,
  isDark = false,
}: Readonly<DeviceConfigurationTabProps>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (param: ConfigParameter) => {
    setEditingId(param.id);
    setEditValue(param.value);
  };

  const handleSaveEdit = (id: string) => {
    onEdit?.(id, editValue);
    setEditingId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const descriptionClass = isDark ? "text-text" : "text-[#1a1a1a]";
  const labelClass = isDark ? "text-text-muted" : "text-[#888]";
  const valueClass = isDark ? "text-text" : "text-[#1a1a1a]";
  const cardClass = isDark
    ? "bg-surface border-border-subtle hover:border-[#555]"
    : "bg-white border-[#e0e0e0] hover:border-[#c0c0c0]";
  const iconBgClass = isDark ? "bg-surface hover:bg-[#333]" : "bg-[#f5f5f5] hover:bg-[#e8e8e8]";
  const iconClass = isDark ? "text-text-muted" : "text-[#595959]";

  return (
    <div className="flex flex-col gap-3">
      <p className={`text-[14px] ${descriptionClass}`}>
        Configura los parámetros del dispositivo seleccionado.
      </p>

      <div className="flex flex-col gap-2">
        {parameters.map((param) => (
          <div
            key={param.id}
            className={`flex items-center justify-between p-3 rounded-[8px] border transition-colors ${cardClass}`}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-[13px] font-['Museo_Sans_300',sans-serif] ${labelClass}`}>
                {param.label}
              </span>
              {editingId === param.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className={`h-8 w-[120px] rounded-[6px] border px-2 text-[14px] outline-none ${isDark ? "bg-surface border-border-subtle text-text" : "bg-white border-[#e0e0e0] text-[#1a1a1a]"} focus:border-[var(--color-primary)]`}
                    autoFocus
                  />
                  {param.unit && (
                    <span className={`text-[13px] ${labelClass}`}>{param.unit}</span>
                  )}
                  <div className="flex gap-1 ml-2">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(param.id)}
                      className="w-7 h-7 rounded-[6px] bg-[#00f1c7] flex items-center justify-center"
                    >
                      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white">
                        <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={`w-7 h-7 rounded-[6px] flex items-center justify-center ${iconBgClass}`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" className={`w-3.5 h-3.5 ${iconClass}`}>
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <span className={`text-[15px] font-['Museo_Sans_500',sans-serif] ${valueClass}`}>
                  {param.value}
                  {param.unit && (
                    <span className={`text-[13px] ml-1 ${labelClass}`}>{param.unit}</span>
                  )}
                </span>
              )}
            </div>

            {editingId !== param.id && (
              <button
                type="button"
                onClick={() => handleStartEdit(param)}
                className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition shrink-0 ${iconBgClass}`}
              >
                <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 ${iconClass}`}>
                  <path
                    d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_PARAMS: ConfigParameter[] = [
  { id: "speed_limit", label: "Velocidad máxima", value: "85", unit: "km/h" },
  { id: "idle_timeout", label: "Tiempo de inactividad", value: "30", unit: "segundos" },
  { id: "geofence_radius", label: "Radio de geocerca", value: "200", unit: "metros" },
  { id: "sos_number", label: "Número SOS", value: "+57 300 123 4567" },
  { id: "apn_name", label: "APN", value: "internet.moviles.com" },
];
