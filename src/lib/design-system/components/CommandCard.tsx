import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — CommandCard / Comando (Organism / Domain)
 *
 * Remote command card for vehicle actions (lock, unlock, horn, etc.)
 * Icon + title + description + status + action control.
 * ────────────────────────────────────────────── */

export type CommandIconColor = "brand" | "success" | "warning" | "error" | "neutral";
export type CommandStatus = "pending" | "sent" | "success" | "error";

export interface CommandCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  iconColor?: CommandIconColor;
  title: string;
  description?: string;
  status?: CommandStatus;
  statusText?: string;
  active?: boolean;
  action?: ReactNode;
}

const iconColorClass: Record<CommandIconColor, string> = {
  brand: "ds-command-card__icon--brand",
  success: "ds-command-card__icon--success",
  warning: "ds-command-card__icon--warning",
  error: "ds-command-card__icon--error",
  neutral: "",
};

export const CommandCard = forwardRef<HTMLDivElement, CommandCardProps>(
  (
    {
      icon,
      iconColor = "brand",
      title,
      description,
      status,
      statusText,
      active = false,
      action,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-command-card ${active ? "ds-command-card--active" : ""} ${className}`.trim()}
        {...rest}
      >
        {icon && (
          <span className={`ds-command-card__icon ${iconColorClass[iconColor]}`}>
            {icon}
          </span>
        )}
        <div className="ds-command-card__body">
          <span className="ds-command-card__title">{title}</span>
          {description && <span className="ds-command-card__desc">{description}</span>}
          {status && statusText && (
            <span className={`ds-command-card__status ds-command-card__status--${status}`}>
              {status === "pending" && <DotIcon />}
              {status === "sent" && <SendIcon />}
              {status === "success" && <CheckIcon />}
              {status === "error" && <XIcon />}
              {statusText}
            </span>
          )}
        </div>
        {action && <span className="ds-command-card__action">{action}</span>}
      </div>
    );
  },
);

CommandCard.displayName = "CommandCard";

function DotIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
