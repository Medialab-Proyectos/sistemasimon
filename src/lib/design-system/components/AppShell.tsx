import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — AppShell (Template)
 *
 * Main app layout: sidebar + navbar + content area.
 * Background: neutral-50, all inner panels radius-lg.
 * ────────────────────────────────────────────── */

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  navbar?: ReactNode;
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  ({ sidebar, navbar, children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={`ds-app-shell ${className}`.trim()} {...rest}>
        {sidebar && <aside className="ds-app-shell__sidebar">{sidebar}</aside>}
        <div className="ds-app-shell__main">
          {navbar && <div className="ds-app-shell__navbar">{navbar}</div>}
          <div className="ds-app-shell__content">{children}</div>
        </div>
      </div>
    );
  },
);

AppShell.displayName = "AppShell";
