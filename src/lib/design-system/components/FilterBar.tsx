import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  actions?: ReactNode;
}

export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  ({ actions, children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={`ds-filter-bar ${className}`.trim()} {...rest}>
        <div className="ds-filter-bar__controls">{children}</div>
        {actions && <div className="ds-filter-bar__actions">{actions}</div>}
      </div>
    );
  },
);

FilterBar.displayName = "FilterBar";
