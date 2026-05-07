import { Select, MultiSelect, Button, FilterBar } from "../../../lib/design-system/components";
import type { SelectOption, MultiSelectOption } from "../../../lib/design-system/components";

/* ── Filter bar for Reports page ── */

const dispositivoOptions: SelectOption[] = [
  { value: "1", label: "Dispositivo 1" },
  { value: "2", label: "Dispositivo 2" },
  { value: "3", label: "Dispositivo 3" },
  { value: "4", label: "Dispositivo 4" },
  { value: "5", label: "Dispositivo 5" },
];

const gruposOptions: SelectOption[] = [
  { value: "1", label: "Grupo 1" },
  { value: "2", label: "Grupo 2" },
  { value: "3", label: "Grupo 3" },
  { value: "4", label: "Grupo 4" },
  { value: "5", label: "Grupo 5" },
];

const periodoOptions: SelectOption[] = [
  { value: "hoy", label: "Hoy" },
  { value: "ayer", label: "Ayer" },
  { value: "semana_actual", label: "Semana Actual" },
  { value: "semana_anterior", label: "Semana Anterior" },
  { value: "mes_actual", label: "Mes Actual" },
  { value: "mes_anterior", label: "Mes Anterior" },
  { value: "personalizado", label: "Personalizado" },
];

const tipoEventosOptions: SelectOption[] = [
  { value: "todos", label: "Todos los eventos" },
  { value: "resultado_comando", label: "Resultado del comando" },
  { value: "en_linea", label: "Dispositivo en Línea" },
  { value: "desconocido", label: "Dispositivo en estado Desconocido" },
  { value: "inactivo", label: "Dispositivo Inactivo" },
  { value: "comando_enviado", label: "Comando en cola enviado" },
  { value: "en_movimiento", label: "Dispositivo en movimiento" },
];

const columnasOptions: MultiSelectOption[] = [
  { value: "dispositivos", label: "Dispositivos" },
  { value: "hora_ajustada", label: "Hora ajustada" },
  { value: "tipo", label: "Tipo" },
  { value: "geo_zona", label: "Geo-Zona" },
  { value: "mantenimiento", label: "Mantenimientos" },
  { value: "direccion", label: "Dirección Calle" },
  { value: "datos", label: "Datos" },
];

export interface ReportsFiltersProps {
  dispositivo?: string;
  grupo?: string;
  periodo?: string;
  tipoEvento?: string;
  columnas?: string[];
  onDispositivoChange?: (value: string) => void;
  onGrupoChange?: (value: string) => void;
  onPeriodoChange?: (value: string) => void;
  onTipoEventoChange?: (value: string) => void;
  onColumnasChange?: (values: string[]) => void;
  onClear?: () => void;
  onApply?: () => void;
  hasFiltersApplied?: boolean;
  applyDisabled?: boolean;
}

export function ReportsFilters({
  dispositivo,
  grupo,
  periodo,
  tipoEvento,
  columnas,
  onDispositivoChange,
  onGrupoChange,
  onPeriodoChange,
  onTipoEventoChange,
  onColumnasChange,
  onClear,
  onApply,
  hasFiltersApplied = false,
  applyDisabled = false,
}: ReportsFiltersProps) {
  return (
    <FilterBar
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Borrar todo
          </Button>
          <Button
            variant={hasFiltersApplied ? "secundario" : "principal"}
            size="sm"
            onClick={onApply}
            disabled={applyDisabled}
          >
            Aplicar
          </Button>
        </>
      }
    >
        <Select
          label="Dispositivo"
          placeholder="Dispositivo"
          value={dispositivo}
          options={dispositivoOptions}
          state={dispositivo ? "completed" : "enable"}
          onChange={onDispositivoChange}
          showInfoIcon={false}
          showSupportIcon={false}
        />
        <Select
          label="Grupos"
          placeholder="Grupos"
          value={grupo}
          options={gruposOptions}
          state={grupo ? "completed" : "enable"}
          onChange={onGrupoChange}
          showInfoIcon={false}
          showSupportIcon={false}
        />
        <Select
          label="Periodo"
          placeholder="Periodo"
          value={periodo}
          options={periodoOptions}
          state={periodo ? "completed" : "enable"}
          onChange={onPeriodoChange}
          showInfoIcon={false}
          showSupportIcon={false}
        />
        <Select
          label="Tipo de eventos"
          placeholder="Tipo de eventos"
          value={tipoEvento}
          options={tipoEventosOptions}
          state={tipoEvento ? "completed" : "enable"}
          onChange={onTipoEventoChange}
          showInfoIcon={false}
          showSupportIcon={false}
        />
        <MultiSelect
          label="Columnas"
          placeholder="Columnas"
          value={columnas}
          options={columnasOptions}
          state={columnas && columnas.length > 0 ? "completed" : "enable"}
          onChange={onColumnasChange}
        />
    </FilterBar>
  );
}
