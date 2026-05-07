import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface ModuleShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
  topBarRight?: ReactNode;
  theme?: "light" | "dark";
}

export const ModuleShell = forwardRef<HTMLDivElement, ModuleShellProps>(
  (
    {
      sidebar,
      eyebrow,
      title,
      actions,
      topBarRight,
      theme = "light",
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} data-theme={theme} className={`ds-module-shell ${className}`.trim()} {...rest}>
        {sidebar}
        <main className="ds-module-shell__main">
          <header className="ds-module-shell__topbar">
            <div className="ds-module-shell__title-group">
              {eyebrow && <p className="ds-module-shell__eyebrow">{eyebrow}</p>}
              <h1 className="ds-module-shell__title">{title}</h1>
            </div>
            {topBarRight && <div className="ds-module-shell__topbar-right">{topBarRight}</div>}
          </header>
          {actions && <div className="ds-module-shell__actions">{actions}</div>}
          {children}
        </main>
      </div>
    );
  },
);

ModuleShell.displayName = "ModuleShell";
