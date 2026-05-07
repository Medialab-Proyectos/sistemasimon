export type ScadaThemeMode = "light" | "dark";

export type GetAuthHeaders = () => Record<string, string>;
export type ResolveApiUrl = (path: string) => string;

export interface ScadaDeviceLite {
  id: ScadaId;
  name?: string | null;
}

export interface ScadaEventLite {
  id?: ScadaId | null;
  deviceId?: ScadaId | null;
  type?: string | null;
  eventTime?: string | number | null;
  attributes?: Record<string, unknown> | null;
}

export interface ScadaPositionLite {
  id?: ScadaId | null;
  deviceId: ScadaId;
  latitude: number;
  longitude: number;
  course?: number | null;
  fixTime?: string | number | null;
  attributes?: Record<string, unknown> | null;
}

export type ScadaId = string | number;

export interface ScadaModuleConfig {
  themeMode?: ScadaThemeMode;

  /**
   * Host-provided CSS variables for perfect theme parity.
   * Keys are CSS variable names (e.g. `--color-background`).
   */
  themeCssVars?: Record<string, string> | null;

  /** Same as TraccarWeb `server.attributes.colorPrimary` (validated hex only). */
  colorPrimary?: string | null;
  /** Same as TraccarWeb `server.attributes.colorSecondary` (validated hex only). */
  colorSecondary?: string | null;

  apiBaseUrl?: string | null;
  getAuthHeaders?: GetAuthHeaders;
  /**
   * Resolver de URLs idéntico al host (usa su getApiUrl).
   * Cuando se provee, SCADA NO concatena `apiBaseUrl` manualmente.
   */
  resolveApiUrl?: ResolveApiUrl;

  /**
   * Alertas: inyección desde el host (un solo socket).
   * El microside SCADA NO abre WebSocket.
   */
  events?: ScadaEventLite[] | null;

  /**
   * Devices (para resolver nombres en alertas).
   * Puede ser el merge del host (API + socket).
   */
  devicesById?: Record<string, ScadaDeviceLite> | null;

  /**
   * Tracking positions from host (single socket owner).
   */
  positions?: ScadaPositionLite[] | null;

  /**
   * Host-injected map module preferences (mirrors TraccarWeb attribute preferences).
   * SCADA should not decide these on its own.
   */
  prefs?: Record<string, unknown> | null;

  /**
   * Groups injected from host (for filters parity with TraccarWeb).
   */
  groupsById?: Record<string, { id: ScadaId; name?: string | null; groupId?: ScadaId | null }> | null;

  /**
   * Host feature flags (ex: disableEvents).
   */
  features?: Record<string, boolean> | null;
}
