/**
 * Design System SM — Components
 *
 * Re-exports all atomic, molecule, and organism UI components.
 */

/* ── Icons ── */
export { Icon } from "../icons";
export type { IconName, IconProps } from "../icons";

/* ── Brand ── */
export { SimonLogo } from "./SimonLogo";
export type { SimonLogoProps, SimonLogoVariant } from "./SimonLogo";

export { SimonWatermark } from "./SimonWatermark";
export type { SimonWatermarkProps } from "./SimonWatermark";

/* ── Atoms ── */
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { Input, TextArea } from "./Input";
export type { InputProps, TextAreaProps, InputStatus } from "./Input";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeColor, BadgeShape } from "./Badge";

export { Checkbox } from "./Checkbox";
export type { CheckboxProps } from "./Checkbox";

export { Avatar } from "./Avatar";
export type { AvatarProps, AvatarSize, AvatarStatus } from "./Avatar";

/* ── Molecules ── */
export { Tooltip } from "./Tooltip";
export type { TooltipProps, TooltipPosition } from "./Tooltip";

export { DropdownItem } from "./DropdownItem";
export type { DropdownItemProps, DropdownItemState } from "./DropdownItem";

export { MenuItem } from "./MenuItem";
export type { MenuItemProps, MenuItemState } from "./MenuItem";

export { Step } from "./Stepper";
export type { StepProps, StepState } from "./Stepper";

export { Tab } from "./Tab";
export type { TabProps, TabState } from "./Tab";

export { ProfileCard } from "./ProfileCard";
export type { ProfileCardProps } from "./ProfileCard";

export { Accordion } from "./Accordion";
export type { AccordionProps } from "./Accordion";

export { CardKit } from "./CardKit";
export type { CardKitProps } from "./CardKit";

export { CardNotification } from "./CardNotification";
export type { CardNotificationProps, CardNotificationType } from "./CardNotification";

export { LocationMarker } from "./LocationMarker";
export type {
  LocationMarkerProps,
  LocationColor,
  LocationState,
  LocationDirection,
} from "./LocationMarker";

export { FilterBar } from "./FilterBar";
export type { FilterBarProps } from "./FilterBar";

export { SummaryTile } from "./SummaryTile";
export type { SummaryTileProps, SummaryTileTone } from "./SummaryTile";

export { DataTable } from "./DataTable";
export type { DataTableColumn, DataTableProps } from "./DataTable";

export { ThemeToggle } from "./ThemeToggle";
export type { ThemeMode, ThemeToggleProps } from "./ThemeToggle";

export { AppHeaderActions } from "./AppHeaderActions";
export type { AppHeaderActionsProps, AppHeaderUser } from "./AppHeaderActions";

export { SimonModuleTemplate } from "./SimonModuleTemplate";
export type { SimonModuleTemplateProps, SimonModuleNavItem } from "./SimonModuleTemplate";

/* ── Organisms ── */
export { Alert } from "./Alert";
export type { AlertProps, AlertColor } from "./Alert";

export { Modal } from "./Modal";
export type { ModalProps } from "./Modal";

export { Select } from "./Select";
export type { SelectProps, SelectState, SelectOption } from "./Select";

export { Pagination } from "./Pagination";
export type { PaginationProps } from "./Pagination";

export { NavBar } from "./NavBar";
export type { NavBarProps, NavBarSize } from "./NavBar";

export { Sidebar } from "./Sidebar";
export type { SidebarProps } from "./Sidebar";

export { Dropdown } from "./Dropdown";
export type { DropdownProps } from "./Dropdown";

export { TableRow } from "./TableRow";
export type { TableRowProps, TableRowType } from "./TableRow";

export { Uploader } from "./Uploader";
export type { UploaderProps, UploaderState } from "./Uploader";

export { Calendar } from "./Calendar";
export type { CalendarProps, CalendarVariant } from "./Calendar";

export { TimePicker } from "./TimePicker";
export type { TimePickerProps } from "./TimePicker";

export { NavBottom } from "./NavBottom";
export type { NavBottomProps, NavBottomItem } from "./NavBottom";

export { MultiSelect } from "./MultiSelect";
export type { MultiSelectProps, MultiSelectState, MultiSelectOption } from "./MultiSelect";

export { Notification } from "./Notification";
export type { NotificationProps, NotificationItem } from "./Notification";

/* ── Organisms (Domain Cards) ── */
export { CardTipo } from "./CardTipo";
export type { CardTipoProps } from "./CardTipo";

export { KpiCard } from "./KpiCard";
export type { KpiCardProps, KpiTrend } from "./KpiCard";

export { VehicleCard } from "./VehicleCard";
export type { VehicleCardProps, VehicleCardVariant, VehicleInfoRow } from "./VehicleCard";

export { VehicleInfo } from "./VehicleInfo";
export type { VehicleInfoProps, VehicleInfoField, VehicleInfoSection } from "./VehicleInfo";

export { GeozonaCard } from "./GeozonaCard";
export type { GeozonaCardProps, GeozonaAccent, GeozonaVariant, GeozonaMetaItem } from "./GeozonaCard";

export { SpeedCard } from "./SpeedCard";
export type { SpeedCardProps, SpeedZone, SpeedMetaItem } from "./SpeedCard";

export { CommandCard } from "./CommandCard";
export type { CommandCardProps, CommandIconColor, CommandStatus } from "./CommandCard";

export { CardInfo } from "./CardInfo";
export type { CardInfoProps, CardInfoColor } from "./CardInfo";

export { CarCard } from "./CarCard";
export type { CarCardProps, CarStatus, CarCardDetail } from "./CarCard";

export { GuanteraCard } from "./GuanteraCard";
export type { GuanteraCardProps, GuanteraIconType } from "./GuanteraCard";

export { AsistenciaCard } from "./AsistenciaCard";
export type { AsistenciaCardProps, AsistenciaStatus } from "./AsistenciaCard";

export { VehiculoApp } from "./VehiculoApp";
export type { VehiculoAppProps, VehiculoAppStatus } from "./VehiculoApp";

/* ── Templates ── */
export { AppShell } from "./AppShell";
export type { AppShellProps } from "./AppShell";

export { MapLayout } from "./MapLayout";
export type { MapLayoutProps } from "./MapLayout";

export { FormLayout } from "./FormLayout";
export type { FormLayoutProps, BreadcrumbItem } from "./FormLayout";

export { TableLayout } from "./TableLayout";
export type { TableLayoutProps } from "./TableLayout";

export { ModuleShell } from "./ModuleShell";
export type { ModuleShellProps } from "./ModuleShell";
