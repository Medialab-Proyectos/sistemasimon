/**
 * Design System SM — Token Constants
 *
 * TypeScript-accessible design tokens for programmatic use
 * (e.g., inline styles, charting libraries, theme providers).
 *
 * These values mirror the CSS custom properties in tokens.css.
 */

// ── Colors ──────────────────────────────────────

export const colors = {
  brand: {
    50: "#E7FFFA",
    100: "#C6FFF0",
    200: "#92FFE7",
    300: "#4DFFE0",
    400: "#00F1C7",
    500: "#00E8BD",
    600: "#00BE9C",
    700: "#009882",
    800: "#007868",
    900: "#006257",
    950: "#003833",
  },
  neutral: {
    50: "#F6F6F6",
    100: "#E7E7E7",
    200: "#D1D1D1",
    300: "#B0B0B0",
    400: "#888888",
    500: "#6D6D6D",
    600: "#5D5D5D",
    700: "#454545",
    800: "#373737",
    900: "#1A1A1A",
    950: "#000000",
  },
  white: "#FFFFFF",
  success: {
    50: "#F0FDF0",
    100: "#DDFBDE",
    200: "#BCF6BE",
    300: "#99EF9E",
    400: "#4EDA56",
    500: "#26C130",
    600: "#19A022",
    700: "#187D1F",
    800: "#18631D",
    900: "#16511B",
    950: "#062D0A",
  },
  warning: {
    50: "#FEFFE7",
    100: "#FCFFC1",
    200: "#FEFF86",
    300: "#FFF941",
    400: "#FFEC0D",
    500: "#FAD900",
    600: "#D1A300",
    700: "#A67502",
    800: "#895B0A",
    900: "#744A0F",
    950: "#442704",
  },
  error: {
    50: "#FFF1F1",
    100: "#FFE1E1",
    200: "#FFC8C8",
    300: "#FFA1A1",
    400: "#FE6B6B",
    500: "#F63D3D",
    600: "#E52A2A",
    700: "#C01515",
    800: "#9E1616",
    900: "#831919",
    950: "#470808",
  },
} as const;

// ── Spacing ─────────────────────────────────────

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  13: "52px",
  14: "56px",
  15: "60px",
  16: "64px",
  18: "72px",
  20: "80px",
  30: "120px",
} as const;

// ── Border Radius ───────────────────────────────

export const radius = {
  xxs: "2px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  full: "120px",
} as const;

// ── Elevation / Shadows ─────────────────────────

export const shadows = {
  xs: "0 2px 4px 0 rgba(93, 93, 93, 0.16)",
  sm: "0 16px 32px -4px rgba(26, 26, 26, 0.10), 0 2px 4px 0 rgba(26, 26, 26, 0.04)",
  md: "0 24px 48px -8px rgba(26, 26, 26, 0.12), 0 2px 4px 0 rgba(26, 26, 26, 0.04)",
  lg: "0 40px 80px -16px rgba(26, 26, 26, 0.16), 0 2px 4px 0 rgba(26, 26, 26, 0.04)",
  xl: "0 56px 112px -20px rgba(26, 26, 26, 0.18), 0 2px 4px 0 rgba(26, 26, 26, 0.04)",
} as const;

// ── Breakpoints ─────────────────────────────────

export const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "1280px",
  xl: "1440px",
} as const;

// ── Typography ──────────────────────────────────

export const fontWeights = {
  light: 100,
  regular: 300,
  semibold: 500,
  bold: 700,
} as const;

export const typography = {
  h1: { size: "4rem", lineHeight: "3.75rem" },
  h2: { size: "3rem", lineHeight: "3.25rem" },
  h3: { size: "2.5rem", lineHeight: "2.75rem" },
  h4: { size: "2rem", lineHeight: "2.25rem" },
  h5: { size: "1.5rem", lineHeight: "1.75rem" },
  h6: { size: "1.25rem", lineHeight: "1.25rem" },
  bodyLg: { size: "1.25rem", lineHeight: "1.25rem" },
  body: { size: "1rem", lineHeight: "1rem" },
  bodySm: { size: "0.75rem", lineHeight: "0.75rem" },
} as const;
