import type { CSSProperties } from "react";

/** Same rule as TraccarWeb `shared/theme/palette.js` */
export function validatedHex(color: string | null | undefined): string | null {
  return color && /^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null;
}

/** TraccarWeb `shared/theme/tokens.json` → CSS variables for SCADA (Tailwind arbitrary `bg-[--token]`). */
const LIGHT: Record<string, string> = {
  "--color-background": "#FFFFFF",
  "--color-surface": "#EBFCF8",
  "--color-surface-elevated": "#E7FFFA",
  "--color-border-subtle": "#E0E0E0",
  "--color-divider": "#D0D0D0",

  "--color-primary": "#007868",
  "--color-primary-hover": "#00F1C7",
  "--color-primary-active": "#009882",
  "--color-secondary": "#007A9B",

  "--color-text": "#181818",
  "--color-text-muted": "#696969",
  "--color-text-disabled": "#BDBDBD",
  "--color-text-on-primary": "#FFFFFF",

  "--color-success": "#4CAF50",
  "--color-success-bg": "#E8F5E9",
  "--color-warning": "#FFA726",
  "--color-warning-bg": "#FFF3E0",
  "--color-error": "#EF5350",
  "--color-error-bg": "#FFEBEE",
  "--color-info": "#29B6F6",
  "--color-info-bg": "#E3F2FD",

  "--color-menu-active-start": "#00F1C7",
  "--color-menu-active-end": "#E7FFFA",
  "--color-menu-hover-start": "#00F1C7",
  "--color-menu-hover-end": "#E7FFFA",

  "--scada-card-bg": "#FFFFFF",
  "--scada-panel-bg": "#FFFFFF",
  "--scada-input-bg": "#FFFFFF",
};

const DARK: Record<string, string> = {
  "--color-background": "#000000",
  "--color-surface": "#000000",
  "--color-surface-elevated": "#242424",
  "--color-border-subtle": "#424242",
  "--color-divider": "#37474F",

  "--color-primary": "#00BE9C",
  "--color-primary-hover": "#00F1C7",
  "--color-primary-active": "#92FFE7",
  "--color-secondary": "#64B5F6",

  "--color-text": "#EBFCF8",
  "--color-text-muted": "#FFFFFF",
  "--color-text-disabled": "#546E7A",
  "--color-text-on-primary": "#FFFFFF",

  "--color-success": "#66BB6A",
  "--color-success-bg": "#1B5E20",
  "--color-warning": "#FFA726",
  "--color-warning-bg": "#E65100",
  "--color-error": "#EF5350",
  "--color-error-bg": "#B71C1C",
  "--color-info": "#29B6F6",
  "--color-info-bg": "#01579B",

  "--color-menu-active-start": "#007868",
  "--color-menu-active-end": "#003833",
  "--color-menu-hover-start": "#007868",
  "--color-menu-hover-end": "#003833",

  "--scada-card-bg": "#242424",
  "--scada-panel-bg": "#0F0F0F",
  "--scada-input-bg": "#0F0F0F",
};

export type ThemeCssInput = {
  themeMode?: string;
  colorPrimary?: string | null;
  colorSecondary?: string | null;
  themeCssVars?: Record<string, string> | null;
};

export function buildScadaThemeCssVars(config?: ThemeCssInput): CSSProperties {
  const dark = config?.themeMode === "dark";
  const vars: Record<string, string> = { ...(dark ? DARK : LIGHT) };
  if (config?.themeCssVars) {
    Object.assign(vars, config.themeCssVars);
  }

  const p = validatedHex(config?.colorPrimary ?? undefined);
  const s = validatedHex(config?.colorSecondary ?? undefined);
  if (p) vars["--color-primary"] = p;
  if (s) vars["--color-secondary"] = s;

  vars["--color-primary-foreground"] = vars["--color-text-on-primary"] ?? "#FFFFFF";
  vars["--scada-fg"] = vars["--color-text"] ?? "";
  vars["--scada-muted"] = vars["--color-text-muted"] ?? "";

  return vars as CSSProperties;
}
