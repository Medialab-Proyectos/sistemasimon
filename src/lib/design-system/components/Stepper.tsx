import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Stepper / Step (Molecule)
 *
 * Figma specs:
 *   States: enable | in-progress | correct | error
 *   Text: Body (16px)
 *     enable: regular, neutral-400
 *     in-progress: semibold, brand-800
 *     correct: semibold, success-800
 *     error: semibold, error-800
 *   Indicator:
 *     enable: 12px gray dot
 *     in-progress: 24px brand circle
 *     correct: 24px neutral-200 circle + check
 *     error: 24px neutral-200 circle + X
 *   Hover: neutral-50 background
 * ────────────────────────────────────────────── */

export type StepState = "enable" | "in-progress" | "correct" | "error";

export interface StepProps extends HTMLAttributes<HTMLDivElement> {
  state?: StepState;
  label?: string;
  icon?: ReactNode;
}

const stateClass: Record<StepState, string> = {
  enable: "ds-step--enable",
  "in-progress": "ds-step--in-progress",
  correct: "ds-step--correct",
  error: "ds-step--error",
};

export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ state = "enable", label, icon, className = "", ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`ds-step ${stateClass[state]} ${className}`.trim()}
        {...rest}
      >
        <div className="ds-step__info">
          {icon && <span className="ds-step__icon">{icon}</span>}
          {label && <span className="ds-step__label">{label}</span>}
        </div>
        <span className="ds-step__indicator" aria-hidden="true">
          {state === "correct" && (
            <svg viewBox="0 0 16 16" fill="none" className="ds-step__svg">
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {state === "error" && (
            <svg viewBox="0 0 16 16" fill="none" className="ds-step__svg">
              <path
                d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </div>
    );
  },
);

Step.displayName = "Step";
