import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
  Icon,
  Pagination,
  SimonModuleTemplate,
  type SimonModuleNavItem,
  Tab,
  TableLayout,
  type ThemeMode,
} from "../../../lib/design-system/components";
import { ReportsFilters } from "../components/ReportsFilters";
import { appHeaderUser } from "../../../shared/lib/appHeaderUser";
import "../styles/reports.css";

const reportTypes = [
  "Combinado",
  "Eventos",
  "Viajes",
  "Paradas",
  "Resumen",
  "Gráfica",
  "Repetición ruta",
  "Posiciones",
] as const;

type ReportType = (typeof reportTypes)[number];

const reportIconByType: Record<ReportType, SimonModuleNavItem["iconName"]> = {
  Combinado: "shuffle",
  Eventos: "pin",
  Viajes: "road-horizon",
  Paradas: "circle-parking",
  Resumen: "clipboard-list",
  Gráfica: "chart-pie",
  "Repetición ruta": "refresh-cw",
  Posiciones: "target",
};

function isReportType(value: string): value is ReportType {
  return reportTypes.includes(value as ReportType);
}

interface ReportRow {
  id: number;
  device: string;
  adjustedTime: string;
  type: string;
  geofence: string;
  maintenance: string;
  address: string;
  data: string;
  distance: string;
  duration: string;
  speed: string;
  status: "ok" | "warning" | "neutral";
}

const rows: ReportRow[] = [
  {
    id: 1,
    device: "Vehículo 01",
    adjustedTime: "2026-05-06 08:24",
    type: "Movimiento",
    geofence: "Zona Norte",
    maintenance: "Sin novedad",
    address: "Cra. 7 #72-41, Bogotá",
    data: "Ignición activa",
    distance: "18.4 km",
    duration: "42 min",
    speed: "54 km/h",
    status: "ok",
  },
  {
    id: 2,
    device: "Vehículo 14",
    adjustedTime: "2026-05-06 09:12",
    type: "Exceso velocidad",
    geofence: "Autopista",
    maintenance: "Revisión próxima",
    address: "Autopista Norte #116, Bogotá",
    data: "Pico 82 km/h",
    distance: "31.8 km",
    duration: "1 h 05 min",
    speed: "82 km/h",
    status: "warning",
  },
  {
    id: 3,
    device: "Camión 03",
    adjustedTime: "2026-05-06 10:03",
    type: "Parada",
    geofence: "Bodega Central",
    maintenance: "Sin novedad",
    address: "Calle 80 #68-32, Bogotá",
    data: "Motor apagado",
    distance: "0.0 km",
    duration: "28 min",
    speed: "0 km/h",
    status: "neutral",
  },
  {
    id: 4,
    device: "Moto 22",
    adjustedTime: "2026-05-06 11:46",
    type: "Entrada geozona",
    geofence: "Cliente Chapinero",
    maintenance: "Sin novedad",
    address: "Calle 63 #9-12, Bogotá",
    data: "Entrega confirmada",
    distance: "7.2 km",
    duration: "19 min",
    speed: "38 km/h",
    status: "ok",
  },
  {
    id: 5,
    device: "Vehículo 08",
    adjustedTime: "2026-05-06 13:31",
    type: "Sin señal",
    geofence: "Fuera de zona",
    maintenance: "Validar equipo",
    address: "Última posición conocida",
    data: "GPS intermitente",
    distance: "12.6 km",
    duration: "34 min",
    speed: "46 km/h",
    status: "warning",
  },
];

const tableConfig: Record<ReportType, { title: string; subtitle: string; columns: string[] }> = {
  Combinado: {
    title: "Combinado",
    subtitle: "Vista consolidada de eventos, recorridos, paradas y posiciones.",
    columns: ["Dispositivo", "Hora ajustada", "Tipo", "Geo-Zona", "Dirección calle", "Datos"],
  },
  Eventos: {
    title: "Eventos",
    subtitle: "Eventos registrados por dispositivo durante el periodo seleccionado.",
    columns: ["Dispositivo", "Hora ajustada", "Tipo", "Geo-Zona", "Mantenimientos", "Datos"],
  },
  Viajes: {
    title: "Viajes",
    subtitle: "Trayectos calculados con distancia, duración y velocidad promedio.",
    columns: ["Dispositivo", "Inicio", "Dirección calle", "Distancia", "Duración", "Velocidad"],
  },
  Paradas: {
    title: "Paradas",
    subtitle: "Detenciones detectadas con ubicación y tiempo acumulado.",
    columns: ["Dispositivo", "Hora ajustada", "Geo-Zona", "Dirección calle", "Duración", "Datos"],
  },
  Resumen: {
    title: "Resumen",
    subtitle: "Indicadores agrupados para lectura rápida de la operación.",
    columns: ["Dispositivo", "Eventos", "Distancia", "Duración", "Velocidad", "Estado"],
  },
  Gráfica: {
    title: "Gráfica",
    subtitle: "Distribución visual de actividad por dispositivo.",
    columns: ["Dispositivo", "Actividad", "Distancia", "Duración", "Velocidad", "Estado"],
  },
  "Repetición ruta": {
    title: "Repetición ruta",
    subtitle: "Secuencia de posiciones para reproducir el recorrido.",
    columns: ["Dispositivo", "Hora ajustada", "Dirección calle", "Distancia", "Velocidad", "Datos"],
  },
  Posiciones: {
    title: "Posiciones",
    subtitle: "Historial de puntos reportados por cada dispositivo.",
    columns: ["Dispositivo", "Hora ajustada", "Geo-Zona", "Dirección calle", "Velocidad", "Datos"],
  },
};

function statusLabel(status: ReportRow["status"]) {
  if (status === "ok") return "Normal";
  if (status === "warning") return "Revisar";
  return "Pausado";
}

function cellFor(column: string, row: ReportRow, activeReport: ReportType) {
  switch (column) {
    case "Dispositivo":
      return <span className="reports-table__device">{row.device}</span>;
    case "Hora ajustada":
    case "Inicio":
      return row.adjustedTime;
    case "Tipo":
      return row.type;
    case "Geo-Zona":
      return row.geofence;
    case "Mantenimientos":
      return row.maintenance;
    case "Dirección calle":
      return row.address;
    case "Datos":
      return row.data;
    case "Distancia":
      return row.distance;
    case "Duración":
      return row.duration;
    case "Velocidad":
      return row.speed;
    case "Eventos":
      return activeReport === "Resumen" ? "12 eventos" : row.type;
    case "Actividad":
      return <ActivityBar value={row.status === "warning" ? 74 : row.status === "ok" ? 58 : 24} />;
    case "Estado":
      return (
        <Badge color={row.status === "warning" ? "error" : row.status === "ok" ? "success" : "secondary"}>
          {statusLabel(row.status)}
        </Badge>
      );
    default:
      return "";
  }
}

function buildColumns(
  columnNames: string[],
  activeReport: ReportType,
): DataTableColumn<ReportRow>[] {
  return columnNames.map((column) => ({
    id: column,
    header: column,
    render: (row) => cellFor(column, row, activeReport),
  }));
}

function ActivityBar({ value }: { value: number }) {
  return (
    <span className="reports-activity" aria-label={`${value}% de actividad`}>
      <span className="reports-activity__fill" style={{ width: `${value}%` }} />
    </span>
  );
}

export function ReportsPage() {
  const navigate = useNavigate();
  const [activeReport, setActiveReport] = useState<ReportType>("Eventos");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [dispositivo, setDispositivo] = useState("");
  const [grupo, setGrupo] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [columnas, setColumnas] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const config = tableConfig[activeReport];
  const hasPendingFilter = Boolean(dispositivo || grupo || periodo || tipoEvento || columnas.length);
  const columns = useMemo(
    () => buildColumns(config.columns, activeReport),
    [activeReport, config.columns],
  );
  const visibleRows = useMemo(() => {
    if (!filtersApplied) return [];
    if (!dispositivo) return rows;
    return rows.filter((row) => row.id === Number(dispositivo));
  }, [dispositivo, filtersApplied]);

  const clearFilters = () => {
    setDispositivo("");
    setGrupo("");
    setPeriodo("");
    setTipoEvento("");
    setColumnas([]);
    setFiltersApplied(false);
    setPage(1);
  };

  const navItems: SimonModuleNavItem[] = [
    { id: "map", iconName: "map-pinned", label: "Mapa" },
    { id: "glovebox", iconName: "briefcase", label: "Guantera" },
    { id: "geofences", iconName: "map-pin", label: "Geocercas" },
    { id: "administrative", iconName: "settings-2", label: "Administrativo", expandable: true },
    {
      id: "reports",
      iconName: "chart-column",
      label: "Reportes",
      selected: true,
      defaultOpen: true,
      children: reportTypes.map((report) => ({
        id: `reports-${report}`,
        iconName: reportIconByType[report],
        label: report,
        selected: report === activeReport,
      })),
    },
    { id: "settings", iconName: "settings", label: "Ajustes", expandable: true },
    { id: "panic", iconName: "alert-triangle", label: "Botón de pánico" },
  ];

  return (
    <SimonModuleTemplate
      themeMode={themeMode}
      onThemeModeChange={setThemeMode}
      user={appHeaderUser}
      eyebrow="Módulo"
      title="Reportes"
      navItems={navItems}
      onNavItemSelect={(item) => {
        if (item.id === "map") navigate("/scada/map");
        if (item.id === "panic") navigate("/scada/alerts");
        if (!isReportType(item.label)) return;
        setActiveReport(item.label);
        setPage(1);
      }}
    >
      <section className="reports-filter-panel">
        <div className="reports-tabs" role="tablist" aria-label="Tipo de reporte">
          <Tab tabState="selected">Mostrar</Tab>
          <Tab tabState="enable">Planificación</Tab>
        </div>
        <ReportsFilters
          dispositivo={dispositivo}
          grupo={grupo}
          periodo={periodo}
          tipoEvento={tipoEvento}
          columnas={columnas}
          onDispositivoChange={setDispositivo}
          onGrupoChange={setGrupo}
          onPeriodoChange={setPeriodo}
          onTipoEventoChange={setTipoEvento}
          onColumnasChange={setColumnas}
          onClear={clearFilters}
          onApply={() => {
            setFiltersApplied(true);
            setPage(1);
          }}
          hasFiltersApplied={filtersApplied}
          applyDisabled={!hasPendingFilter}
        />
      </section>

      <section className="reports-results-panel">
        <div className="reports-results-panel__actions">
          <Button
            variant="secundario"
            size="sm"
            rightIcon={<Icon name="download" size={18} />}
            disabled={!filtersApplied}
          >
            Exportar
          </Button>
          <Button
            variant="secundario"
            size="sm"
            rightIcon={<Icon name="printer" size={16} />}
            disabled={!filtersApplied}
          >
            Imprimir
          </Button>
        </div>
        <TableLayout className="reports-table">
          <DataTable
            columns={columns}
            rows={visibleRows}
            getRowKey={(row) => row.id}
            emptyState="Usa los filtros para realizar tu primera consulta."
            emptyColSpan={1}
          />
        </TableLayout>
      </section>

      <section className="reports-pagination-panel">
        <span>Resultados 10 de 48</span>
        <Pagination currentPage={page} totalPages={4} onPageChange={setPage} />
      </section>
    </SimonModuleTemplate>
  );
}
