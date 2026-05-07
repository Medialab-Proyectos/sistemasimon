import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../icons";

/* ──────────────────────────────────────────────
 * Design System SM — ProfileCard (Molecule)
 *
 * Figma specs:
 *   Layout: horizontal, gap 12px
 *   Avatar: 40px (uses Avatar atom or img)
 *   Name: H6 (20px) semibold, black
 *   Role: Body S (12px) regular, brand-800
 *   Dropdown: 24px chevron-up (open) / chevron-down (close)
 *   Type: open | close (controls chevron direction)
 * ────────────────────────────────────────────── */

export interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  avatar?: ReactNode;
  avatarSrc?: string;
  isOpen?: boolean;
  showDropdown?: boolean;
  dropdownIcon?: ReactNode;
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      name,
      role,
      avatar,
      avatarSrc,
      isOpen = false,
      showDropdown = true,
      dropdownIcon,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-profile ${className}`.trim()}
        {...rest}
      >
        {(avatar || avatarSrc) && (
          <span className="ds-profile__avatar">
            {avatar ?? (
              <img
                className="ds-profile__img"
                src={avatarSrc}
                alt={name}
              />
            )}
          </span>
        )}
        <div className="ds-profile__info">
          {name && <span className="ds-profile__name">{name}</span>}
          {role && <span className="ds-profile__role">{role}</span>}
        </div>
        {showDropdown && (
          <span className="ds-profile__dropdown" aria-hidden="true">
            {dropdownIcon ?? (
              <Icon
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={24}
                className="ds-profile__chevron"
              />
            )}
          </span>
        )}
      </div>
    );
  },
);

ProfileCard.displayName = "ProfileCard";
