import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — GuanteraCard (Organism / Domain)
 *
 * Document/file card for vehicle "glove compartment" section.
 * File icon + title + meta (date, size) + status + actions.
 * ────────────────────────────────────────────── */

export type GuanteraIconType = "default" | "pdf" | "image" | "expired";

export interface GuanteraCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  iconType?: GuanteraIconType;
  title: string;
  metaItems?: string[];
  statusBadge?: ReactNode;
  actions?: ReactNode;
}

const iconClass: Record<GuanteraIconType, string> = {
  default: "",
  pdf: "ds-guantera-card__icon--pdf",
  image: "ds-guantera-card__icon--image",
  expired: "ds-guantera-card__icon--expired",
};

export const GuanteraCard = forwardRef<HTMLDivElement, GuanteraCardProps>(
  (
    {
      icon,
      iconType = "default",
      title,
      metaItems,
      statusBadge,
      actions,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`ds-guantera-card ${className}`.trim()} {...rest}>
        <span className={`ds-guantera-card__icon ${iconClass[iconType]}`}>
          {icon ?? <FileIcon />}
        </span>
        <div className="ds-guantera-card__body">
          <span className="ds-guantera-card__title">{title}</span>
          {metaItems && metaItems.length > 0 && (
            <div className="ds-guantera-card__meta">
              {metaItems.map((item, i) => (
                <span key={i}>
                  {i > 0 && <span className="ds-guantera-card__meta-sep" />}
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        {statusBadge}
        {actions && <div className="ds-guantera-card__actions">{actions}</div>}
      </div>
    );
  },
);

GuanteraCard.displayName = "GuanteraCard";

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
