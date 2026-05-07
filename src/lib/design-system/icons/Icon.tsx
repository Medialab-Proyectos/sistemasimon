/**
 * Design System SM — Icon Library
 *
 * Centralized, type-safe icon library based on Lucide icons (matching Figma).
 * All icons render as inline SVGs with `currentColor` so they inherit
 * the parent's text color automatically.
 *
 * Usage:
 *   <Icon name="menu" />
 *   <Icon name="map-pinned" size={24} className="my-icon" />
 */

import type { ReactNode, SVGAttributes } from "react";

/* ── Public API ── */

export type IconName = keyof typeof iconDefs;

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  const def: IconDef = iconDefs[name];
  const vb = def.viewBox ?? "0 0 24 24";
  const fillMode = def.fill ?? false;

  return (
    <svg
      width={size}
      height={size}
      viewBox={vb}
      fill={fillMode ? "currentColor" : "none"}
      stroke={fillMode ? "none" : "currentColor"}
      strokeWidth={fillMode ? undefined : 2}
      strokeLinecap={fillMode ? undefined : "round"}
      strokeLinejoin={fillMode ? undefined : "round"}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {def.content}
    </svg>
  );
}

/* ── Icon definitions ── */

interface IconDef {
  content: ReactNode;
  viewBox?: string;
  fill?: boolean;
}

const iconDefs = {
  /* ─── Esenciales ─── */
  menu: {
    content: (
      <>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </>
    ),
  },
  x: {
    content: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
  },
  plus: {
    content: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
  },
  check: {
    content: <polyline points="20 6 9 17 4 12" />,
  },
  search: {
    content: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
  },
  info: {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
  },
  "alert-triangle": {
    content: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
  },
  edit: {
    content: (
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    ),
  },
  eye: {
    content: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },

  /* ─── Flechas ─── */
  "chevron-down": {
    content: <path d="m6 9 6 6 6-6" />,
  },
  "chevron-up": {
    content: <path d="m18 15-6-6-6 6" />,
  },
  "chevron-left": {
    content: <path d="m15 18-6-6 6-6" />,
  },
  "chevron-right": {
    content: <path d="m9 18 6-6-6-6" />,
  },
  "arrow-left": {
    content: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
  },
  "arrow-right": {
    content: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
  },

  /* ─── Ubicación ─── */
  "map-pinned": {
    content: (
      <>
        <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
        <circle cx="12" cy="8" r="2" />
        <path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835" />
      </>
    ),
  },
  "map-pin": {
    content: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  target: {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  },
  locate: {
    content: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
  },

  /* ─── Negocios ─── */
  briefcase: {
    content: (
      <>
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
  },
  "chart-column": {
    content: (
      <>
        <rect width="6" height="18" x="3" y="3" rx="1" />
        <rect width="6" height="12" x="15" y="9" rx="1" />
      </>
    ),
  },
  "chart-pie": {
    content: (
      <>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </>
    ),
  },
  "clipboard-list": {
    content: (
      <>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </>
    ),
  },

  /* ─── Configuración ─── */
  settings: {
    content: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
  "settings-2": {
    content: (
      <>
        <path d="M20 7h-9" />
        <path d="M14 17H5" />
        <circle cx="17" cy="17" r="3" />
        <circle cx="7" cy="7" r="3" />
      </>
    ),
  },

  /* ─── Reportes (sub-items) ─── */
  shuffle: {
    content: (
      <>
        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
        <path d="m18 2 4 4-4 4" />
        <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
        <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
        <path d="m18 14 4 4-4 4" />
      </>
    ),
  },
  pin: {
    content: (
      <>
        <line x1="12" x2="12" y1="17" y2="22" />
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
      </>
    ),
  },
  "road-horizon": {
    content: (
      <>
        <path d="M12 2v4" />
        <path d="M12 10v2" />
        <path d="M12 16v6" />
        <path d="M4 22 2 12 4 2" />
        <path d="m20 22 2-10-2-10" />
      </>
    ),
  },
  "circle-parking": {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </>
    ),
  },
  "refresh-cw": {
    content: (
      <>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </>
    ),
  },

  /* ─── Status (círculos) ─── */
  "circle-check": {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  "circle-x": {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
  },
  "circle-info": {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
  },

  /* ─── Comunicación ─── */
  "message-square": {
    content: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
  },
  bell: {
    content: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
  },
  "bell-dot": {
    content: (
      <>
        <path d="M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <circle cx="18" cy="8" r="3" />
      </>
    ),
  },

  /* ─── Comandos de vehículo ─── */
  "cmd-car": {
    content: (
      <>
        <path d="M5 17H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1" />
        <path d="M5 17l1.5-3.5L10 17h4l3.5-3.5L19 17" />
        <path d="M7 9l2 2" />
        <path d="M15 11l2-2" />
      </>
    ),
  },
  "cmd-speedometer": {
    content: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
        <path d="M19.4 16.6l-1.6 1.6-1.5-1.5 1.6-1.6" />
      </>
    ),
  },
  "cmd-wifi": {
    content: (
      <>
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" />
      </>
    ),
  },
  "cmd-parking": {
    content: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 7h4a3 3 0 0 1 0 6H9V7Z" />
        <path d="M9 13v4" />
      </>
    ),
  },
  "cmd-no-entry": {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M4.93 4.93l14.14 14.14" />
      </>
    ),
  },
  "cmd-fuel": {
    content: (
      <>
        <path d="M3 22V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" />
        <path d="M3 22h12" />
        <path d="M15 22h6" />
        <path d="M8 8h4" />
        <path d="M6 11h8" />
        <path d="M9 14h2" />
      </>
    ),
  },
  "cmd-lock": {
    content: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
  "cmd-unlock": {
    content: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </>
    ),
  },
  "cmd-cone": {
    content: (
      <>
        <path d="M4 21h16" />
        <path d="M5.5 14h13L12 5 5.5 14Z" />
        <path d="M4 21l1.5-7h13L20 21" />
        <path d="M7 10h10" />
      </>
    ),
  },
  "cmd-barrier": {
    content: (
      <>
        <path d="M4 15h16v2H4z" />
        <path d="M4 11h16v2H4z" />
        <path d="M6 7h12v2H6z" />
        <path d="M2 19h20v2H2z" />
      </>
    ),
  },
  "cmd-plus-circle": {
    content: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </>
    ),
  },

  /* ─── Misceláneos ─── */
  "google-maps": {
    content: (
      <>
        <path d="M12 5c4.5 0 8 3.5 8 7s-3.5 7-8 7-8-3.5-8-7 3.5-7 8-7Z" />
        <circle cx="12" cy="12" r="2.9" fill="currentColor" stroke="none" />
      </>
    ),
  },
  filter: {
    content: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  },
  download: {
    content: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
  },
  printer: {
    content: (
      <>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </>
    ),
  },
  upload: {
    content: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </>
    ),
  },
  trash: {
    content: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
  },
  copy: {
    content: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
  },
  "external-link": {
    content: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
  },
  sun: {
    content: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </>
    ),
  },
  moon: {
    content: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  },
  user: {
    content: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  calendar: {
    content: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  clock: {
    content: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
} as const satisfies Record<string, IconDef>;
