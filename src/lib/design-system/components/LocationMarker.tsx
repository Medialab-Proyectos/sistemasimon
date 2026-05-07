import { forwardRef, type HTMLAttributes } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — LocationMarker (Molecule)
 *
 * Figma specs:
 *   Size: 26x32 (enable/hover), 32x40 (selected)
 *   Colors:
 *     available: success-500 (#26C130)
 *     warning:   warning-400 (#FFEC0D)
 *     error:     error-500  (#F63D3D)
 *     disable:   neutral-300 (#B0B0B0)
 *   States: enable (80% opacity) | hover (100%) | selected (larger + shadow)
 *   Animation: pulsing glow when true
 *   Direction: abajo | arriba | 45-izq | 45-der (rotation of shadow cone)
 * ────────────────────────────────────────────── */

export type LocationColor = "available" | "warning" | "error" | "disable";
export type LocationState = "enable" | "hover" | "selected";
export type LocationDirection = "abajo" | "arriba" | "45-izq" | "45-der";

export interface LocationMarkerProps extends HTMLAttributes<HTMLDivElement> {
  color?: LocationColor;
  state?: LocationState;
  animation?: boolean;
  direction?: LocationDirection;
}

const fillByColor: Record<LocationColor, string> = {
  available: "var(--color-success-500)",
  warning: "var(--color-warning-400)",
  error: "var(--color-error-500)",
  disable: "var(--color-neutral-300)",
};

const glowByColor: Record<LocationColor, string> = {
  available: "var(--color-success-400)",
  warning: "var(--color-warning-300)",
  error: "var(--color-error-400)",
  disable: "var(--color-neutral-200)",
};

const rotationByDir: Record<LocationDirection, string> = {
  abajo: "0deg",
  arriba: "180deg",
  "45-izq": "135deg",
  "45-der": "-135deg",
};

export const LocationMarker = forwardRef<HTMLDivElement, LocationMarkerProps>(
  (
    {
      color = "available",
      state = "enable",
      animation = false,
      direction = "abajo",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const isSelected = state === "selected";
    const size = isSelected ? 40 : 32;
    const pinWidth = isSelected ? 32 : 26;

    return (
      <div
        ref={ref}
        className={`ds-location ds-location--${state} ${animation ? "ds-location--animated" : ""} ${className}`.trim()}
        style={
          {
            "--loc-fill": fillByColor[color],
            "--loc-glow": glowByColor[color],
            "--loc-shadow-rotation": rotationByDir[direction],
            width: pinWidth,
            height: size,
          } as React.CSSProperties
        }
        {...rest}
      >
        {/* Shadow cone (selected only) */}
        {isSelected && (
          <span className="ds-location__shadow" aria-hidden="true" />
        )}

        {/* Pin SVG */}
        <svg
          viewBox="0 0 26 32"
          fill="none"
          className="ds-location__pin"
          aria-label={`Location marker: ${color}`}
        >
          <path
            d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 19 13 19s13-9.25 13-19C26 5.82 20.18 0 13 0z"
            fill="var(--loc-fill)"
          />
          <circle cx="13" cy="13" r="5" fill="white" fillOpacity="0.9" />
        </svg>
      </div>
    );
  },
);

LocationMarker.displayName = "LocationMarker";
