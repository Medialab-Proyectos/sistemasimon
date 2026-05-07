import type { HTMLAttributes } from "react";
import { Avatar } from "./Avatar";
import { ProfileCard } from "./ProfileCard";
import { ThemeToggle, type ThemeMode } from "./ThemeToggle";
import { Icon } from "../icons";

export interface AppHeaderUser {
  name: string;
  role: string;
  avatarSrc?: string;
  avatarAlt?: string;
}

export interface AppHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  user: AppHeaderUser;
  onNotificationsClick?: () => void;
}

export function AppHeaderActions({
  themeMode,
  onThemeModeChange,
  user,
  onNotificationsClick,
  className = "",
  ...rest
}: AppHeaderActionsProps) {
  return (
    <div className={`ds-app-header-actions ${className}`.trim()} {...rest}>
      <ThemeToggle value={themeMode} onChange={onThemeModeChange} />
      <button
        type="button"
        aria-label="Notificaciones"
        className="ds-app-header-actions__notification"
        onClick={onNotificationsClick}
      >
        <Icon name="bell" size={18} />
      </button>
      <ProfileCard
        name={user.name}
        role={user.role}
        avatar={
          <Avatar
            size="md"
            src={user.avatarSrc}
            alt={user.avatarAlt ?? user.name}
            status="disponible"
          />
        }
      />
    </div>
  );
}
