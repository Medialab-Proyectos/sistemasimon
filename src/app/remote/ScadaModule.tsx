import "../../styles/tailwind.css";
import "../../styles/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { ScadaModuleConfig } from "./contracts";
import { ScadaProvider } from "./ScadaProvider";
import { buildScadaThemeCssVars } from "./traccarTheme";
import { OperationsAlarmsPage } from "../../features/alerts/pages/OperationsAlarmsPage";
import { CommandsPage } from "../../features/commands/pages/CommandsPage";
import { CommandEditorPage } from "../../features/commands/pages/CommandEditorPage";
import { CommandCenterPage } from "../../features/commands/pages/CommandCenterPage";
import { MapPage } from "../../features/map/pages/MapPage";
import { ReportsPage } from "../../features/reports/pages/ReportsPage";
import { PanicPage } from "../../features/panic/pages/PanicPage";

export default function ScadaModule({
  config,
}: Readonly<{ config?: ScadaModuleConfig }>) {
  const location = useLocation();
  const path = location.pathname || "";
  const themeVars = useMemo(
    () =>
      buildScadaThemeCssVars({
        themeMode: config?.themeMode ?? "light",
        themeCssVars: config?.themeCssVars ?? null,
        colorPrimary: config?.colorPrimary,
        colorSecondary: config?.colorSecondary,
      }),
    [config?.themeMode, config?.themeCssVars, config?.colorPrimary, config?.colorSecondary],
  );

  let content: React.ReactNode = null;
  if (path.startsWith("/scada/panic")) {
    content = <PanicPage />;
  } else if (path.startsWith("/scada/alerts")) {
    content = <OperationsAlarmsPage />;
  } else if (path.startsWith("/scada/reports")) {
    content = <ReportsPage />;
  } else if (path.startsWith("/scada/commands")) {
    const tail = path.replace("/scada/commands", "") || "";
    const looksLikeEditor = tail.startsWith("/new") || /^\/\d+/.test(tail);
    if (tail.startsWith("/center") || tail === "") {
      content = <CommandCenterPage />;
    } else if (tail.startsWith("/device/")) {
      content = <CommandCenterPage />;
    } else {
      content = looksLikeEditor ? <CommandEditorPage /> : <CommandsPage />;
    }
  } else {
    content = <MapPage />;
  }

  return (
    <div
      className="h-full w-full overflow-hidden bg-background"
      style={themeVars}
    >
      <ScadaProvider config={config}>
        {content}
      </ScadaProvider>
    </div>
  );
}
