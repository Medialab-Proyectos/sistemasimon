import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Uploader (Organism)
 *
 * Figma specs:
 *   States: enable | loading | success | error | preview
 *   Enable: dashed border, neutral-200, icon + text
 *   Loading: progress bar, brand-400
 *   Success: solid border, success-500, check icon
 *   Error: solid border, error-500, X icon
 *   Preview: thumbnail with actions
 *   Border radius: radius-sm (8px)
 *   Padding: 24px
 * ────────────────────────────────────────────── */

export type UploaderState = "enable" | "loading" | "success" | "error" | "preview";

export interface UploaderProps extends HTMLAttributes<HTMLDivElement> {
  state?: UploaderState;
  progress?: number;
  fileName?: string;
  fileSize?: string;
  errorMessage?: string;
  icon?: ReactNode;
  hint?: string;
  onRemove?: () => void;
  onRetry?: () => void;
}

const stateClass: Record<UploaderState, string> = {
  enable: "",
  loading: "ds-uploader--loading",
  success: "ds-uploader--success",
  error: "ds-uploader--error",
  preview: "ds-uploader--preview",
};

export const Uploader = forwardRef<HTMLDivElement, UploaderProps>(
  (
    {
      state = "enable",
      progress = 0,
      fileName,
      fileSize,
      errorMessage,
      icon,
      hint = "Arrastra tu archivo aquí o haz clic para seleccionar",
      onRemove,
      onRetry,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-uploader ${stateClass[state]} ${className}`.trim()}
        {...rest}
      >
        {state === "enable" && (
          <div className="ds-uploader__dropzone">
            <span className="ds-uploader__icon">
              {icon ?? <UploadIcon />}
            </span>
            <span className="ds-uploader__hint">{hint}</span>
          </div>
        )}

        {state === "loading" && (
          <div className="ds-uploader__file">
            <span className="ds-uploader__file-name">{fileName}</span>
            {fileSize && <span className="ds-uploader__file-size">{fileSize}</span>}
            <div className="ds-uploader__progress">
              <div className="ds-uploader__progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="ds-uploader__file">
            <span className="ds-uploader__file-icon ds-uploader__file-icon--success">
              <CheckIcon />
            </span>
            <span className="ds-uploader__file-name">{fileName}</span>
            {fileSize && <span className="ds-uploader__file-size">{fileSize}</span>}
            {onRemove && (
              <button type="button" className="ds-uploader__remove" onClick={onRemove} aria-label="Eliminar">
                <XIcon />
              </button>
            )}
          </div>
        )}

        {state === "error" && (
          <div className="ds-uploader__file">
            <span className="ds-uploader__file-icon ds-uploader__file-icon--error">
              <XIcon />
            </span>
            <div className="ds-uploader__file-info">
              <span className="ds-uploader__file-name">{fileName}</span>
              {errorMessage && <span className="ds-uploader__error-msg">{errorMessage}</span>}
            </div>
            {onRetry && (
              <button type="button" className="ds-uploader__retry" onClick={onRetry}>
                Reintentar
              </button>
            )}
            {onRemove && (
              <button type="button" className="ds-uploader__remove" onClick={onRemove} aria-label="Eliminar">
                <XIcon />
              </button>
            )}
          </div>
        )}

        {state === "preview" && children}
      </div>
    );
  },
);

Uploader.displayName = "Uploader";

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
