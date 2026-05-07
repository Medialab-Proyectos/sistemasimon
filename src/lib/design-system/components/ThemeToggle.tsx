import { forwardRef, type HTMLAttributes } from "react";
import { Icon } from "../icons";

export type ThemeMode = "light" | "dark";

export interface ThemeToggleProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: ThemeMode;
  onChange?: (value: ThemeMode) => void;
}

export const ThemeToggle = forwardRef<HTMLDivElement, ThemeToggleProps>(
  ({ value, onChange, className = "", ...rest }, ref) => {
    const isDark = value === "dark";

    return (
      <div ref={ref} className={`ds-theme-toggle ${className}`.trim()} {...rest}>
        <button
          type="button"
          className="ds-theme-toggle__icon"
          aria-label="Modo claro"
          aria-pressed={!isDark}
          onClick={() => onChange?.("light")}
        >
          <Icon name="sun" size={18} />
        </button>
        <button
          type="button"
          className={`ds-theme-toggle__switch ${isDark ? "ds-theme-toggle__switch--dark" : ""}`}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-pressed={isDark}
          onClick={() => onChange?.(isDark ? "light" : "dark")}
        >
          <span />
        </button>
        <button
          type="button"
          className="ds-theme-toggle__icon"
          aria-label="Modo oscuro"
          aria-pressed={isDark}
          onClick={() => onChange?.("dark")}
        >
          <Icon name="moon" size={18} />
        </button>
      </div>
    );
  },
);

ThemeToggle.displayName = "ThemeToggle";
