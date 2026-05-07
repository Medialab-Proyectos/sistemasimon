import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — CardNotification (Molecule)
 *
 * Figma specs:
 *   Width: flexible (553px reference)
 *   Padding: 16px
 *   Gap: 8px
 *   Border radius: radius-md (12px)
 *   Border: 1px neutral-50
 *   Icon circle: 48px
 *     Email: warning-50 bg, triangle-alert icon
 *     Notification: brand-50 bg, bell-dot icon
 *   Body text: Body (16px) regular, neutral-900
 *   Time: Body L (20px) regular, neutral-400
 *   Badge: brand-50 bg, brand-800 text
 * ────────────────────────────────────────────── */

export type CardNotificationType = "email" | "notification";

export interface CardNotificationProps extends HTMLAttributes<HTMLDivElement> {
  type?: CardNotificationType;
  icon?: ReactNode;
  message?: string;
  time?: string;
  badgeLabel?: string;
}

export const CardNotification = forwardRef<HTMLDivElement, CardNotificationProps>(
  (
    {
      type = "email",
      icon,
      message,
      time,
      badgeLabel,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-card-notif ${className}`.trim()}
        {...rest}
      >
        <div className="ds-card-notif__row">
          <span className={`ds-card-notif__icon ds-card-notif__icon--${type}`}>
            {icon ?? (type === "email" ? <TriangleAlertIcon /> : <BellDotIcon />)}
          </span>

          <div className="ds-card-notif__body">
            {message && <p className="ds-card-notif__text">{message}</p>}
            {children}
          </div>

          <div className="ds-card-notif__meta">
            {time && <span className="ds-card-notif__time">{time}</span>}
            {badgeLabel && (
              <span className="ds-card-notif__badge">{badgeLabel}</span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

CardNotification.displayName = "CardNotification";

/* ── Inline SVG icons (Lucide) ── */

function TriangleAlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ds-card-notif__svg"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function BellDotIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ds-card-notif__svg"
    >
      <path d="M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <circle cx="18" cy="8" r="3" />
    </svg>
  );
}
