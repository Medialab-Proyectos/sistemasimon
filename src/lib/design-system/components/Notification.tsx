import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Notification (Organism)
 *
 * Figma specs:
 *   Panel with header, tabs, scrollable item list
 *   Header: title + "Ver todo" link + close button
 *   Tabs: Todas / No leídas
 *   Items: icon/avatar + title + message + time
 *   Unread: brand-50 bg, brand-400 left accent
 *   Container: white bg, radius-md, shadow-md, 380px width
 * ────────────────────────────────────────────── */

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  time: string;
  read?: boolean;
  icon?: ReactNode;
}

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  items?: NotificationItem[];
  emptyText?: string;
  emptyIcon?: ReactNode;
  showTabs?: boolean;
  onClose?: () => void;
  onViewAll?: () => void;
  onItemClick?: (id: string) => void;
}

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      title = "Notificaciones",
      items = [],
      emptyText = "No tienes notificaciones",
      emptyIcon,
      showTabs = true,
      onClose,
      onViewAll,
      onItemClick,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [tab, setTab] = useState<"all" | "unread">("all");

    const filteredItems = tab === "unread" ? items.filter(i => !i.read) : items;
    const unreadCount = items.filter(i => !i.read).length;

    return (
      <div ref={ref} className={`ds-notification ${className}`.trim()} {...rest}>
        {/* Header */}
        <div className="ds-notification__header">
          <span className="ds-notification__title">{title}</span>
          <div className="ds-notification__header-actions">
            {onViewAll && (
              <button type="button" className="ds-notification__view-all" onClick={onViewAll}>
                Ver todo
              </button>
            )}
            {onClose && (
              <button type="button" className="ds-notification__close" onClick={onClose} aria-label="Cerrar">
                <XIcon />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {showTabs && (
          <div className="ds-notification__tabs">
            <button
              type="button"
              className={`ds-notification__tab ${tab === "all" ? "ds-notification__tab--active" : ""}`}
              onClick={() => setTab("all")}
            >
              Todas
            </button>
            <button
              type="button"
              className={`ds-notification__tab ${tab === "unread" ? "ds-notification__tab--active" : ""}`}
              onClick={() => setTab("unread")}
            >
              No leídas {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        )}

        {/* List */}
        {filteredItems.length > 0 ? (
          <div className="ds-notification__list">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className={`ds-notification__item ${!item.read ? "ds-notification__item--unread" : ""}`}
                onClick={() => onItemClick?.(item.id)}
              >
                {item.icon && (
                  <span className="ds-notification__item-icon">{item.icon}</span>
                )}
                <div className="ds-notification__item-body">
                  <span className="ds-notification__item-title">{item.title}</span>
                  {item.message && (
                    <span className="ds-notification__item-msg">{item.message}</span>
                  )}
                  <span className="ds-notification__item-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ds-notification__empty">
            <span className="ds-notification__empty-icon">
              {emptyIcon ?? <BellOffIcon />}
            </span>
            <span className="ds-notification__empty-text">{emptyText}</span>
          </div>
        )}
      </div>
    );
  },
);

Notification.displayName = "Notification";

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function BellOffIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
      <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
      <path d="M18 8a6 6 0 0 0-9.33-5" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
