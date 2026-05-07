import { useMemo, useState } from "react";
import {
  Button,
  DataTable,
  type DataTableColumn,
  Icon,
  Input,
  Pagination,
  Select,
  SimonModuleTemplate,
  type SimonModuleNavItem,
  Tab,
  TableLayout,
  type ThemeMode,
  TextArea,
} from "../../../lib/design-system/components";
import { appHeaderUser } from "../../../shared/lib/appHeaderUser";
import "../styles/panic.css";

/* ── Types ── */

type PanicTab = "no-gestionadas" | "por-validar" | "gestionadas";

interface PanicRow {
  id: number;
  imei: string;
  placa: string;
  alertas: number;
  contacto: string;
  telefono: string;
  evento: string;
  fechaUltimoEvento: string;
}

/* ── Mock data ── */

const rows: PanicRow[] = [
  { id: 1, imei: "863238070764560", placa: "GHI 567", alertas: 2, contacto: "Adriana Valdes Wilches", telefono: "3213946648", evento: "Alarma de pánico", fechaUltimoEvento: "08/02/2026 06:00 AM" },
  { id: 2, imei: "763218495731245", placa: "ABC 123", alertas: 5, contacto: "Marco Antonio Rivera", telefono: "3213946649", evento: "Sistema de vigilancia", fechaUltimoEvento: "08/01/2026 07:00 AM" },
  { id: 3, imei: "653184920648731", placa: "MNO 789", alertas: 57, contacto: "Lucía Fernández", telefono: "3213946650", evento: "Sensor de movimiento", fechaUltimoEvento: "08/01/2026 07:15 AM" },
  { id: 4, imei: "543197842013256", placa: "DEF 901", alertas: 60, contacto: "Diego Pérez", telefono: "3213946651", evento: "Cámara de seguridad", fechaUltimoEvento: "08/01/2026 07:30 AM" },
  { id: 5, imei: "432109876543210", placa: "STU 345", alertas: 84, contacto: "Sofía Ramos", telefono: "3213946652", evento: "Control de acceso", fechaUltimoEvento: "08/01/2026 07:45 AM" },
  { id: 6, imei: "321098765432109", placa: "VWX 098", alertas: 10, contacto: "Carlos Mendez", telefono: "3213946653", evento: "Iluminación inteligente", fechaUltimoEvento: "08/01/2026 08:00 AM" },
  { id: 7, imei: "210987654321098", placa: "PQR 876", alertas: 24, contacto: "Patricia López", telefono: "3213946654", evento: "Alarma de incendio", fechaUltimoEvento: "08/01/2026 08:15 AM" },
  { id: 8, imei: "109876543210987", placa: "JKL 654", alertas: 7, contacto: "Fernando Garcia", telefono: "3213946655", evento: "Sensor de temperatura", fechaUltimoEvento: "08/01/2026 08:30 AM" },
  { id: 9, imei: "098765432109876", placa: "CDE 213", alertas: 11, contacto: "Valeria Torres", telefono: "3213946656", evento: "Cerraduras inteligentes", fechaUltimoEvento: "08/01/2026 08:45 AM" },
  { id: 10, imei: "987654321098765", placa: "FGH 432", alertas: 2, contacto: "Javier Morales", telefono: "3213946657", evento: "Sistema anti-intrusión", fechaUltimoEvento: "08/01/2026 09:00 AM" },
];

const tipificacionOptions = [
  { value: "", label: "Selecciona la tipificación" },
  { value: "fallas", label: "Fallas botón de pánico" },
  { value: "emergencia", label: "Emergencia real" },
  { value: "prueba", label: "Prueba del sistema" },
  { value: "falsa-alarma", label: "Falsa alarma" },
];

const tabLabels: Record<PanicTab, string> = {
  "no-gestionadas": "No gestionadas",
  "por-validar": "Por validar",
  gestionadas: "Gestionadas",
};

const tabIcons: Record<PanicTab, React.ReactNode> = {
  "no-gestionadas": <Icon name="alert-triangle" size={16} />,
  "por-validar": undefined as unknown as React.ReactNode,
  gestionadas: undefined as unknown as React.ReactNode,
};

const navItems: SimonModuleNavItem[] = [
  { id: "map", iconName: "map-pinned", label: "Mapa" },
  { id: "glovebox", iconName: "briefcase", label: "Guantera" },
  { id: "geofences", iconName: "map-pin", label: "Geocercas" },
  { id: "administrative", iconName: "settings-2", label: "Administrativo", expandable: true },
  { id: "reports", iconName: "chart-column", label: "Reportes", expandable: true },
  { id: "settings", iconName: "settings", label: "Ajustes", expandable: true },
  { id: "panic", iconName: "alert-triangle", label: "Botón de pánico", selected: true },
];

/* ── Full table columns (no panel) ── */

function buildFullColumns(onGestionar: (row: PanicRow) => void): DataTableColumn<PanicRow>[] {
  return [
    { id: "imei", header: "IMEI", render: (r) => <span className="panic-table__imei">{r.imei}</span> },
    { id: "placa", header: "Placa", render: (r) => r.placa },
    { id: "alertas", header: "Alertas", render: (r) => String(r.alertas) },
    { id: "contacto", header: "Contacto", render: (r) => r.contacto },
    { id: "telefono", header: "Teléfono", render: (r) => r.telefono },
    { id: "evento", header: "Evento", render: (r) => r.evento },
    { id: "fecha", header: "Fecha último evento", render: (r) => r.fechaUltimoEvento },
    {
      id: "gestionar",
      header: "Gestionar",
      render: (r) => (
        <button type="button" className="panic-table__gestionar" onClick={() => onGestionar(r)}>
          <Icon name="bell-dot" size={16} />
          Gestionar
        </button>
      ),
    },
  ];
}

/* ── Compact table columns (panel open) ── */

const compactColumns: DataTableColumn<PanicRow>[] = [
  { id: "imei", header: "IMEI", render: (r) => <span className="panic-table__imei">{r.imei}</span> },
  { id: "placa", header: "Placa", render: (r) => r.placa },
  { id: "alertas", header: "Alertas", render: (r) => String(r.alertas) },
  { id: "contacto", header: "Contacto", render: (r) => r.contacto },
  { id: "telefono", header: "Teléfono", render: (r) => r.telefono },
];

/* ── Page ── */

export function PanicPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [activeTab, setActiveTab] = useState<PanicTab>("no-gestionadas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState<PanicRow | null>(null);
  const [tipificacion, setTipificacion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(
      (r) => r.imei.includes(q) || r.placa.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const fullColumns = useMemo(
    () => buildFullColumns((row) => setSelectedRow(row)),
    [],
  );

  const handleClosePanel = () => {
    setSelectedRow(null);
    setTipificacion("");
    setObservaciones("");
  };

  const handleActualizar = () => {
    handleClosePanel();
  };

  return (
    <SimonModuleTemplate
      themeMode={themeMode}
      onThemeModeChange={setThemeMode}
      user={appHeaderUser}
      title="Botón de pánico"
      navItems={navItems}
    >
      {/* ── Tabs + Filter ── */}
      <section className="panic-filter-section" style={{ borderRadius: "var(--radius-md)", background: "var(--ds-color-surface)", overflow: "hidden" }}>
        <div className="panic-tabs" role="tablist" aria-label="Estado de alertas">
          {(Object.keys(tabLabels) as PanicTab[]).map((tab) => (
            <Tab
              key={tab}
              tabState={activeTab === tab ? "selected" : "enable"}
              leftIcon={tabIcons[tab] || undefined}
              onClick={() => { setActiveTab(tab); setPage(1); }}
            >
              {tabLabels[tab]}
            </Tab>
          ))}
        </div>
        <div className="panic-filter">
          <div className="panic-filter__search">
            <Input
              placeholder="Buscar por IMEI, Placa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="panic-filter__actions">
            <Button
              variant="secundario"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Borrar todo
            </Button>
            <Button variant="principal" size="sm">
              Aplicar
            </Button>
          </div>
        </div>
      </section>

      {/* ── Content: table + optional detail panel ── */}
      <div className="panic-content">
        <div className="panic-table-section">
          <div className="panic-table-section__header">
            <h2>{tabLabels[activeTab]}</h2>
          </div>
          <div className="panic-table-section__body">
            <TableLayout>
              <DataTable
                columns={selectedRow ? compactColumns : fullColumns}
                rows={filteredRows}
                getRowKey={(r) => r.id}
                emptyState="No hay registros para mostrar."
                emptyColSpan={1}
                rowClassName={(r) => (selectedRow?.id === r.id ? "panic-row--selected" : "")}
              />
            </TableLayout>
          </div>
        </div>

        {selectedRow && (
          <div className="panic-panel">
            {/* Map placeholder */}
            <div className="panic-panel__map">
              <iframe
                title="Ubicación de alarma"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=-74.1,4.6,-74.05,4.65&layer=mapnik`}
                loading="lazy"
              />
            </div>

            {/* Manage form */}
            <div className="panic-panel__form">
              <div className="panic-panel__form-title">
                <h3>Gestionar alarmas</h3>
                <p>Evidencia el motivo por el cual se valida el registro seleccionado</p>
              </div>
              <div className="panic-panel__form-fields">
                <Select
                  label="Tipificación"
                  required
                  options={tipificacionOptions}
                  value={tipificacion}
                  onChange={setTipificacion}
                />
                <TextArea
                  label="Observaciones"
                  required
                  placeholder="Describe los motivos"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="panic-panel__form-actions">
                <Button variant="secundario" size="sm" onClick={handleClosePanel}>
                  Cancelar
                </Button>
                <Button
                  variant="principal"
                  size="sm"
                  disabled={!tipificacion || !observaciones}
                  onClick={handleActualizar}
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      <section className="panic-pagination">
        <span>Resultados {filteredRows.length} de 48</span>
        <Pagination currentPage={page} totalPages={4} onPageChange={setPage} />
      </section>
    </SimonModuleTemplate>
  );
}
