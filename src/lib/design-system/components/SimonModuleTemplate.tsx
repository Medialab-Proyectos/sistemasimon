import { useState, type HTMLAttributes, type ReactNode } from "react";
import { AppHeaderActions, type AppHeaderUser } from "./AppHeaderActions";
import { Button } from "./Button";
import { Icon, type IconName } from "../icons";
import { MenuItem } from "./MenuItem";
import { ModuleShell } from "./ModuleShell";
import { Sidebar } from "./Sidebar";
import { SimonLogo } from "./SimonLogo";
import { SimonWatermark } from "./SimonWatermark";
import type { ThemeMode } from "./ThemeToggle";

export interface SimonModuleNavItem {
  id: string;
  label: string;
  iconName: IconName;
  selected?: boolean;
  expandable?: boolean;
  defaultOpen?: boolean;
  children?: SimonModuleNavItem[];
}

export interface SimonModuleTemplateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  eyebrow?: string;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  user: AppHeaderUser;
  navItems: SimonModuleNavItem[];
  footer?: ReactNode;
  actions?: ReactNode;
  onNavItemSelect?: (item: SimonModuleNavItem) => void;
}

export function SimonModuleTemplate({
  title,
  eyebrow,
  themeMode,
  onThemeModeChange,
  user,
  navItems,
  footer = "Versión 1.0.0",
  actions,
  onNavItemSelect,
  children,
  ...rest
}: SimonModuleTemplateProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navItems.map((item) => [item.id, Boolean(item.defaultOpen)])),
  );

  const toggleSection = (item: SimonModuleNavItem) => {
    setOpenSections((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    onNavItemSelect?.(item);
  };

  const renderItem = (item: SimonModuleNavItem, isChild = false) => {
    const hasChildren = Boolean(item.children?.length);
    const isOpen = Boolean(openSections[item.id]);

    return (
      <div key={item.id} className="ds-sidebar__section">
        <MenuItem
          icon={<Icon name={item.iconName} />}
          label={item.label}
          state={!isChild && item.selected ? "selected" : "enable"}
          className={isChild && item.selected ? "ds-menu-item--sub-active" : ""}
          rightIcon={
            item.expandable || hasChildren
              ? <Icon name={isOpen ? "chevron-up" : "chevron-down"} />
              : undefined
          }
          onClick={() => {
            if (item.expandable || hasChildren) {
              toggleSection(item);
              return;
            }
            onNavItemSelect?.(item);
          }}
        />
        {hasChildren && (
          <div className={`ds-sidebar__sub-items ${isOpen ? "ds-sidebar__sub-items--open" : ""}`}>
            {item.children?.map((child) => renderItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ModuleShell
      {...rest}
      theme={themeMode}
      eyebrow={eyebrow}
      title={title}
      actions={actions}
      topBarRight={
        <AppHeaderActions
          themeMode={themeMode}
          onThemeModeChange={onThemeModeChange}
          user={user}
        />
      }
      sidebar={
        <Sidebar
          collapsed={collapsed}
          watermark={<SimonWatermark />}
          logo={
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ds-sidebar__menu-button"
                aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
                onClick={() => setCollapsed(!collapsed)}
              >
                <Icon name="menu" size={16} />
              </Button>
              {!collapsed && (
                <SimonLogo variant={themeMode === "dark" ? "dark" : "light"} />
              )}
              {!collapsed && <span className="ds-sidebar__logo-spacer" />}
            </>
          }
          footer={footer}
        >
          {navItems.map((item) => renderItem(item))}
        </Sidebar>
      }
    >
      {children}
    </ModuleShell>
  );
}
