import { useState } from "react";

export interface VehicleInfo {
  plate: string;
  imei: string;
  iccid: string;
  vehicleType: string;
  connected: boolean;
}

interface VehicleInfoCardProps {
  vehicle: VehicleInfo | null;
  onCollapse?: () => void;
  isDark?: boolean;
}

export function VehicleInfoCard({ vehicle, onCollapse, isDark = false }: Readonly<VehicleInfoCardProps>) {
  const [collapsed, setCollapsed] = useState(false);

  if (!vehicle) return null;

  const handleCollapse = () => {
    setCollapsed((c) => !c);
    onCollapse?.();
  };

  const labelClass = isDark ? "text-text-muted" : "text-[#888]";
  const valueClass = isDark ? "text-text" : "text-[#1a1a1a]";
  const chevronClass = isDark ? "text-text-muted" : "text-[#888]";

  return (
    <div className={`rounded-[10px] p-4 flex flex-col gap-2 ${isDark ? "bg-surface-elevated border border-border-subtle" : "bg-white border border-[#e0e0e0]"}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[16px] font-['Museo_Sans_500',sans-serif] ${labelClass}`}>
          Información vehículo
        </p>
        <button
          type="button"
          onClick={handleCollapse}
          className={`w-8 h-8 flex items-center justify-center rounded-[8px] transition ${isDark ? "hover:bg-surface" : "hover:bg-[#f5f5f5]"}`}
          aria-label={collapsed ? "Expandir" : "Colapsar"}
        >
          <svg
            className={`w-4 h-4 transition-transform ${collapsed ? "-rotate-90" : "rotate-0"} ${chevronClass}`}
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="flex items-center gap-8 flex-wrap">
          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className={`text-[14px] ${labelClass}`}>Placa</span>
            <span className={`text-[28px] font-['Museo_Sans_700',sans-serif] leading-[28px] ${valueClass}`}>
              {vehicle.plate}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className={`text-[14px] ${labelClass}`}>IMEI del Dispositivo</span>
            <span className={`text-[18px] font-['Museo_Sans_500',sans-serif] ${valueClass}`}>
              {vehicle.imei}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className={`text-[14px] ${labelClass}`}>ICCID (Serie de la tarjeta SIM)</span>
            <span className={`text-[18px] font-['Museo_Sans_500',sans-serif] ${valueClass}`}>
              {vehicle.iccid}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className={`text-[14px] ${labelClass}`}>Tipo de vehículo</span>
            <span className={`text-[18px] font-['Museo_Sans_500',sans-serif] ${valueClass}`}>
              {vehicle.vehicleType}
            </span>
          </div>

          <div
            className={`flex items-center gap-[6px] px-2 py-1 rounded-[4px] ${
              vehicle.connected
                ? isDark ? "bg-[#1a3d1a]" : "bg-[#f0fdf0]"
                : isDark ? "bg-[#3d1a1a]" : "bg-[#fff3f0]"
            }`}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center ${
                vehicle.connected
                  ? isDark ? "text-[#4caf50]" : "text-[#18631D]"
                  : isDark ? "text-[#ef5350]" : "text-[#b71c1c]"
              }`}
            >
              <svg viewBox="0 0 18 18" fill="none" className="w-full h-full">
                <path
                  d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9L8 11L12 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-[14px] font-['Museo_Sans_500',sans-serif] ${
                vehicle.connected
                  ? isDark ? "text-[#4caf50]" : "text-[#18631d]"
                  : isDark ? "text-[#ef5350]" : "text-[#b71c1c]"
              }`}
            >
              {vehicle.connected ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
