import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Badge (Atom)
 *
 * Figma specs:
 *   Colors: primary | secondary | success | error | warning
 *   Shape: pill (120px radius) | square (4px radius)
 *   Padding: 8px horizontal, 4px vertical
 *   Font: Body SM (12px) semibold
 * ────────────────────────────────────────────── */

export type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning";
export type BadgeShape = "pill" | "square";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  shape?: BadgeShape;
  icon?: ReactNode;
}

const colorClass: Record<BadgeColor, string> = {
  primary: "ds-badge--primary",
  secondary: "ds-badge--secondary",
  success: "ds-badge--success",
  error: "ds-badge--error",
  warning: "ds-badge--warning",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { color = "primary", shape = "pill", icon, children, className = "", ...rest },
    ref,
  ) => {
    const shapeClass = shape === "pill" ? "ds-badge--pill" : "ds-badge--square";

    return (
      <span
        ref={ref}
        className={`ds-badge ${colorClass[color]} ${shapeClass} ${className}`.trim()}
        {...rest}
      >
        {icon && <span className="ds-badge__icon">{icon}</span>}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
