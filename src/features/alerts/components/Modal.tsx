import type { ReactNode } from "react";

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
}: Readonly<{
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <dialog
        open
        className="relative m-0 w-full max-w-lg overflow-hidden rounded-2xl border border-[--color-border-subtle] bg-[--color-surface] p-0 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[--color-border-subtle] bg-[--color-surface-elevated] px-4 py-3">
          <div className="text-sm font-semibold text-[--color-text]">{title}</div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-[--color-text-muted] hover:bg-[--color-surface]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? (
          <div className="border-t border-[--color-border-subtle] bg-[--color-surface-elevated] px-4 py-3">
            {footer}
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

