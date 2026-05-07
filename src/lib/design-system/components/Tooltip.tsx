import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Tooltip (Molecule)
 *
 * Figma specs:
 *   Position: bottom-center | bottom-left | bottom-right |
 *             up-center | up-left | up-right | left | right
 *   Background: neutral-50 (#F6F6F6)
 *   Border radius: 8px (radius-sm)
 *   Padding: 12px
 *   Backdrop blur: 15px
 *   Header: Body S (12px) bold
 *   Body: Body S (12px) regular
 *   Arrow: CSS triangle
 * ────────────────────────────────────────────── */

export type TooltipPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "up-center"
  | "up-left"
  | "up-right"
  | "left"
  | "right";

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  position?: TooltipPosition;
  header?: ReactNode;
  body?: ReactNode;
  showArrow?: boolean;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      position = "bottom-center",
      header,
      body,
      showArrow = true,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const isUp = position.startsWith("up");
    const isLeft = position === "left";
    const isRight = position === "right";
    const isHorizontal = isLeft || isRight;

    const alignClass = position.endsWith("left")
      ? "ds-tooltip--align-start"
      : position.endsWith("right")
        ? "ds-tooltip--align-end"
        : "ds-tooltip--align-center";

    const dirClass = isHorizontal
      ? `ds-tooltip--horizontal ds-tooltip--${position}`
      : isUp
        ? "ds-tooltip--up"
        : "ds-tooltip--down";

    return (
      <div
        ref={ref}
        className={`ds-tooltip ${dirClass} ${alignClass} ${className}`.trim()}
        role="tooltip"
        {...rest}
      >
        {!isUp && !isLeft && (
          <div className="ds-tooltip__content">
            {header && <p className="ds-tooltip__header">{header}</p>}
            {(body || children) && (
              <p className="ds-tooltip__body">{body ?? children}</p>
            )}
          </div>
        )}

        {showArrow && <span className={`ds-tooltip__arrow ds-tooltip__arrow--${position}`} aria-hidden="true" />}

        {(isUp || isLeft) && (
          <div className="ds-tooltip__content">
            {header && <p className="ds-tooltip__header">{header}</p>}
            {(body || children) && (
              <p className="ds-tooltip__body">{body ?? children}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
