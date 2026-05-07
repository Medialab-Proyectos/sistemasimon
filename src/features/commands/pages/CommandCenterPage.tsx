import { useState, useCallback } from "react";
import { useScada } from "../../../app/remote/ScadaProvider";
import { DeviceSearchBar } from "../components/DeviceSearchBar";
import { VehicleInfoCard, type VehicleInfo } from "../components/VehicleInfoCard";
import { CommandTabs, type CommandTab } from "../components/CommandTabs";
import { CommandSelector } from "../components/CommandSelector";
import { DeliveryOptions, type DeliveryMethod } from "../components/DeliveryOptions";
import { CommandActionFooter } from "../components/CommandActionFooter";
import { CreateCommandForm } from "../components/CreateCommandForm";
import { CommandHistoryTable } from "../components/CommandHistoryTable";
import { PaginationHistoryTable } from "../components/PaginationHistoryTable";
import { DeviceConfigurationTab } from "../components/DeviceConfigurationTab";
import { CommandsEmptyState } from "../components/CommandsEmptyState";
import { Toast, type ToastType } from "../components/Toast";
import { useMockDeviceSearch } from "../hooks/useMockDeviceSearch";

interface ToastState {
  message: string;
  description?: string;
  type: ToastType;
}

export function CommandCenterPage() {
  const { config } = useScada();
  const isDark = (config.themeMode ?? "light") === "dark";
  const { search: searchDevice, loading: searchLoading } = useMockDeviceSearch();

  const [activeTab, setActiveTab] = useState<CommandTab>("comandos");
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [selectedCommandId, setSelectedCommandId] = useState<number | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod | null>(null);

  const [historyPage, setHistoryPage] = useState(1);
  const [toast, setToast] = useState<ToastState | null>(null);

  const canSend = vehicle !== null && selectedCommandId !== null && selectedDelivery !== null;

  const showToast = useCallback((message: string, description?: string, type: ToastType = "success") => {
    setToast({ message, description, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      const result = await searchDevice(query);
      if (result) {
        setVehicle(result);
      } else {
        setVehicle(null);
        showToast("Vehículo no encontrado", "No hay dispositivos con esa placa, IMEI o ICCID.", "info");
      }
    },
    [searchDevice, showToast],
  );

  const handleSend = useCallback(() => {
    if (!canSend) return;
    showToast("Comando creado correctamente", "El comando fue creado correctamente, puedes hacer uso de él inmediatamente.", "success");
    setSelectedCommandId(null);
    setSelectedDelivery(null);
  }, [canSend, showToast]);

  const handleCreateCommand = useCallback((data: { name: string; description: string; iconId: string }) => {
    console.log("Nuevo comando:", data);
    setShowCreateForm(false);
    showToast("Comando creado correctamente", `El comando "${data.name}" fue creado exitosamente.`, "success");
  }, [showToast]);

  const containerClass = isDark
    ? "bg-[#121212]"
    : "bg-[#F4F7F6]";

  const cardClass = isDark
    ? "bg-surface-elevated border-border-subtle"
    : "bg-white border-gray-100";

  const textClass = isDark ? "text-text" : "text-[#1a1a1a]";

  if (showCreateForm) {
    return (
      <div className={`w-full h-full ${containerClass} overflow-y-auto p-4 sm:p-6`}>
        <div className="max-w-[600px] mx-auto">
          <CreateCommandForm
            onCancel={() => setShowCreateForm(false)}
            onSave={handleCreateCommand}
            isDark={isDark}
          />
        </div>
        {toast && <Toast {...toast} onClose={closeToast} />}
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${containerClass} overflow-y-auto`}>
      <div className="flex flex-col gap-4 p-4 sm:p-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className={`text-[24px] font-bold ${textClass} font-['Museo_Sans_700',sans-serif]`}>
            Centro de Comandos
          </h1>
        </div>

        <DeviceSearchBar
          onSearch={handleSearch}
          loading={searchLoading}
          isDark={isDark}
        />

        {vehicle ? (
          <>
            <VehicleInfoCard vehicle={vehicle} isDark={isDark} />

            <div className={`rounded-[10px] overflow-hidden border ${cardClass}`}>
              <CommandTabs activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />

              <div className="p-4">
                {activeTab === "comandos" && (
                  <div className="flex flex-col gap-5">
                    <CommandSelector
                      selectedId={selectedCommandId}
                      onSelect={setSelectedCommandId}
                      onCreateNew={() => setShowCreateForm(true)}
                      isDark={isDark}
                    />

                    <DeliveryOptions
                      selected={selectedDelivery}
                      onSelect={setSelectedDelivery}
                      isDark={isDark}
                    />

                    <CommandActionFooter
                      onSend={handleSend}
                      disabled={!canSend}
                      isDark={isDark}
                    />
                  </div>
                )}

                {activeTab === "configuracion" && (
                  <DeviceConfigurationTab isDark={isDark} />
                )}

                {activeTab === "historial" && (
                  <div className="flex flex-col gap-0">
                    <CommandHistoryTable isDark={isDark} />
                    <PaginationHistoryTable
                      currentPage={historyPage}
                      totalPages={5}
                      totalItems={48}
                      onPageChange={setHistoryPage}
                      isDark={isDark}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <CommandsEmptyState isDark={isDark} />
        )}
      </div>

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
}
