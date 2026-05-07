import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — VehicleInfo (Organism / Domain)
 *
 * Covers "Info Vehiculo corporativo" and "Info Vehiculo refactor".
 * Detail panel with header, grouped info sections, and footer.
 * ────────────────────────────────────────────── */

export interface VehicleInfoField {
  label: string;
  value: string | ReactNode;
}

export interface VehicleInfoSection {
  title?: string;
  fields: VehicleInfoField[];
}

export interface VehicleInfoProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  subtitle?: string;
  imageSrc?: string;
  statusBadge?: ReactNode;
  sections?: VehicleInfoSection[];
  footer?: ReactNode;
}

export const VehicleInfo = forwardRef<HTMLDivElement, VehicleInfoProps>(
  (
    {
      name,
      subtitle,
      imageSrc,
      statusBadge,
      sections,
      footer,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`ds-vehicle-info ${className}`.trim()} {...rest}>
        <div className="ds-vehicle-info__header">
          <div className="ds-vehicle-info__avatar">
            {imageSrc ? (
              <img src={imageSrc} alt={name} />
            ) : (
              <CarIcon />
            )}
          </div>
          <div className="ds-vehicle-info__header-body">
            <span className="ds-vehicle-info__name">{name}</span>
            {subtitle && <span className="ds-vehicle-info__subtitle">{subtitle}</span>}
          </div>
          {statusBadge}
        </div>

        {sections?.map((section, i) => (
          <div key={i} className="ds-vehicle-info__section">
            {section.title && (
              <span className="ds-vehicle-info__section-title">{section.title}</span>
            )}
            {section.fields.map((field, j) => (
              <div key={j} className="ds-vehicle-info__field">
                <span className="ds-vehicle-info__field-label">{field.label}</span>
                <span className="ds-vehicle-info__field-value">{field.value}</span>
              </div>
            ))}
          </div>
        ))}

        {footer && <div className="ds-vehicle-info__footer">{footer}</div>}
      </div>
    );
  },
);

VehicleInfo.displayName = "VehicleInfo";

function CarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17v2m14-2v2" />
      <circle cx="7.5" cy="14" r="1.5" /><circle cx="16.5" cy="14" r="1.5" />
    </svg>
  );
}
