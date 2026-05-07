import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Avatar (Atom)
 *
 * Figma specs:
 *   Sizes: sm=28px | md=40px | lg=64px | xl=88px
 *   Styles: photo | initials | icon
 *   Status: none | disponible (brand-400) | ocupado (error-400) | inactivo (warning-500)
 *   Shape: circle (radius-full)
 * ────────────────────────────────────────────── */

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "disponible" | "ocupado" | "inactivo";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  initials?: string;
  icon?: ReactNode;
  status?: AvatarStatus;
}

const sizeClass: Record<AvatarSize, string> = {
  sm: "ds-avatar--sm",
  md: "ds-avatar--md",
  lg: "ds-avatar--lg",
  xl: "ds-avatar--xl",
};

const statusClass: Record<AvatarStatus, string> = {
  disponible: "ds-avatar__status--disponible",
  ocupado: "ds-avatar__status--ocupado",
  inactivo: "ds-avatar__status--inactivo",
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { size = "md", src, alt, initials, icon, status, className = "", ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-avatar ${sizeClass[size]} ${className}`.trim()}
        {...rest}
      >
        {src ? (
          <img className="ds-avatar__img" src={src} alt={alt ?? ""} />
        ) : initials ? (
          <span className="ds-avatar__initials">{initials}</span>
        ) : icon ? (
          <span className="ds-avatar__icon">{icon}</span>
        ) : (
          <span className="ds-avatar__initials">?</span>
        )}
        {status && (
          <span
            className={`ds-avatar__status ${statusClass[status]}`}
            aria-label={status}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
