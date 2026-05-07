import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type SummaryTileTone = "brand" | "success" | "warning" | "error" | "neutral";

export interface SummaryTileProps extends HTMLAttributes<HTMLElement> {
  label: string;
  value: ReactNode;
  tone?: SummaryTileTone;
  meta?: ReactNode;
}

export const SummaryTile = forwardRef<HTMLElement, SummaryTileProps>(
  ({ label, value, tone = "brand", meta, className = "", ...rest }, ref) => {
    return (
      <article
        ref={ref}
        className={`ds-summary-tile ds-summary-tile--${tone} ${className}`.trim()}
        {...rest}
      >
        <span className="ds-summary-tile__label">{label}</span>
        <strong className="ds-summary-tile__value">{value}</strong>
        {meta && <span className="ds-summary-tile__meta">{meta}</span>}
      </article>
    );
  },
);

SummaryTile.displayName = "SummaryTile";
