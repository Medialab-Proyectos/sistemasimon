import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Input / TextArea (Atom)
 *
 * Figma specs:
 *   States: default | completed | error | success | disabled
 *   Border radius: 8px (radius-sm)
 *   Padding: 16px horizontal, 8px vertical
 *   Font: Body L (20px) for input text
 *   Focus ring: brand-400 outline
 *   Label: Body SM (12px) semibold, neutral-500
 *   Helper text: Body SM (12px), color per status
 * ────────────────────────────────────────────── */

export type InputStatus = "default" | "error" | "success" | "disabled";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  status?: InputStatus;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> {
  label?: string;
  helperText?: string;
  status?: InputStatus;
}

const statusClass: Record<InputStatus, string> = {
  default: "",
  error: "ds-input--error",
  success: "ds-input--success",
  disabled: "ds-input--disabled",
};

const helperColor: Record<InputStatus, string> = {
  default: "ds-helper--default",
  error: "ds-helper--error",
  success: "ds-helper--success",
  disabled: "ds-helper--default",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      status = "default",
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...rest
    },
    ref,
  ) => {
    const resolvedStatus = disabled ? "disabled" : status;

    return (
      <div className={`ds-input-wrapper ${className}`.trim()}>
        {label && <label className="ds-input__label">{label}</label>}
        <div className={`ds-input ${statusClass[resolvedStatus]}`}>
          {leftIcon && (
            <span className="ds-input__icon ds-input__icon--left">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className="ds-input__field"
            disabled={disabled}
            {...rest}
          />
          {rightIcon && (
            <span className="ds-input__icon ds-input__icon--right">
              {rightIcon}
            </span>
          )}
        </div>
        {helperText && (
          <span className={`ds-helper ${helperColor[resolvedStatus]}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { label, helperText, status = "default", className = "", disabled, ...rest },
    ref,
  ) => {
    const resolvedStatus = disabled ? "disabled" : status;

    return (
      <div className={`ds-input-wrapper ${className}`.trim()}>
        {label && <label className="ds-input__label">{label}</label>}
        <textarea
          ref={ref}
          className={`ds-textarea ${statusClass[resolvedStatus]}`}
          disabled={disabled}
          {...rest}
        />
        {helperText && (
          <span className={`ds-helper ${helperColor[resolvedStatus]}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
