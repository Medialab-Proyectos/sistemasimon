import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const TOAST_STYLES: Record<ToastType, { border: string; icon: React.ReactNode }> = {
  success: {
    border: "#2e7d32",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 text-[#2e7d32]">
        <path
          d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6 9L8 11L12 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    border: "#c62828",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 text-[#c62828]">
        <path
          d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M6 6L12 12M12 6L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  info: {
    border: "#1565c0",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 text-[#1565c0]">
        <path
          d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M9 8V12M9 5.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

export function Toast({
  message,
  description,
  type = "success",
  duration = 4000,
  onClose,
}: Readonly<ToastProps>) {
  const style = TOAST_STYLES[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex items-start gap-3 bg-white rounded-[10px] shadow-xl border-l-4 p-4 max-w-[360px] animate-in slide-in-from-right duration-300"
      style={{ borderLeftColor: style.border }}
    >
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-[#1a1a1a] text-[14px] font-semibold font-['Museo_Sans_500',sans-serif]">
          {message}
        </p>
        {description && (
          <p className="text-[#888] text-[13px] font-['Museo_Sans_300',sans-serif]">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-[4px] hover:bg-[#f5f5f5] transition"
      >
        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-[#888]">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
