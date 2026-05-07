import { createContext, useContext, useMemo } from "react";
import type { ScadaModuleConfig } from "./contracts";
import { createApiClient } from "./apiClient";

export interface ScadaRuntime {
  config: ScadaModuleConfig;
  api: ReturnType<typeof createApiClient>;
}

const ScadaContext = createContext<ScadaRuntime | null>(null);

export function ScadaProvider({
  config,
  children,
}: Readonly<{ config?: ScadaModuleConfig; children: React.ReactNode }>) {
  // Host may pass a new config object every render; keep runtime stable by memoizing
  // based on the fields that affect API resolution/auth.
  const safeConfig = useMemo(() => (config ?? {}), [config]);
  const apiDeps = useMemo(
    () => ({
      apiBaseUrl: safeConfig.apiBaseUrl ?? null,
      resolveApiUrl: safeConfig.resolveApiUrl ?? null,
      getAuthHeaders: safeConfig.getAuthHeaders ?? null,
    }),
    [safeConfig.apiBaseUrl, safeConfig.getAuthHeaders, safeConfig.resolveApiUrl],
  );
  const api = useMemo(() => createApiClient(safeConfig), [apiDeps]);

  const value = useMemo<ScadaRuntime>(
    () => ({ config: safeConfig, api }),
    [api, safeConfig],
  );

  return <ScadaContext.Provider value={value}>{children}</ScadaContext.Provider>;
}

export function useScada() {
  const ctx = useContext(ScadaContext);
  if (!ctx) {
    throw new Error("useScada must be used within <ScadaProvider />");
  }
  return ctx;
}

