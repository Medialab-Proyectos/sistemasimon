import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — AsistenciaCard (Organism / Domain)
 *
 * Roadside assistance / help request card.
 * Icon + title + detail + status + time + actions.
 * ────────────────────────────────────────────── */

export type AsistenciaStatus = "active" | "completed" | "cancelled" | "pending";

export interface AsistenciaCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  status?: AsistenciaStatus;
  title: string;
  detail?: string;
  meta?: string;
  time?: string;
  statusBadge?: ReactNode;
  actions?: ReactNode;
}

const iconStatusClass: Record<AsistenciaStatus, string> = {
  active: "ds-asistencia-card__icon--active",
  completed: "ds-asistencia-card__icon--completed",
  cancelled: "ds-asistencia-card__icon--cancelled",
  pending: "ds-asistencia-card__icon--pending",
};

export const AsistenciaCard = forwardRef<HTMLDivElement, AsistenciaCardProps>(
  (
    {
      icon,
      status = "active",
      title,
      detail,
      meta,
      time,
      statusBadge,
      actions,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`ds-asistencia-card ${className}`.trim()} {...rest}>
        {icon && (
          <span className={`ds-asistencia-card__icon ${iconStatusClass[status]}`}>
            {icon}
          </span>
        )}
        <div className="ds-asistencia-card__body">
          <span className="ds-asistencia-card__title">{title}</span>
          {detail && <span className="ds-asistencia-card__detail">{detail}</span>}
          {meta && <span className="ds-asistencia-card__meta">{meta}</span>}
          {statusBadge}
        </div>
        <div className="ds-asistencia-card__right">
          {time && <span className="ds-asistencia-card__time">{time}</span>}
          {actions && <div className="ds-asistencia-card__actions">{actions}</div>}
        </div>
      </div>
    );
  },
);

AsistenciaCard.displayName = "AsistenciaCard";
