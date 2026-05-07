import { forwardRef, type HTMLAttributes } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — TimePicker (Organism)
 *
 * Figma specs:
 *   Components: Hour spinner + Minute spinner + Period toggle
 *   Spinners: up/down arrows, center value (brand-400 bg, white text)
 *   Period: AM/PM vertical toggle, brand-400 active
 *   56px per spinner, gap 8px
 * ────────────────────────────────────────────── */

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  hour?: number;
  minute?: number;
  period?: "AM" | "PM";
  minuteStep?: number;
  onChange?: (hour: number, minute: number, period: "AM" | "PM") => void;
}

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      hour = 12,
      minute = 0,
      period = "AM",
      minuteStep = 1,
      onChange,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const adjustHour = (delta: number) => {
      let h = hour + delta;
      if (h > 12) h = 1;
      if (h < 1) h = 12;
      onChange?.(h, minute, period);
    };

    const adjustMinute = (delta: number) => {
      let m = minute + delta * minuteStep;
      if (m >= 60) m = 0;
      if (m < 0) m = 60 - minuteStep;
      onChange?.(hour, m, period);
    };

    const togglePeriod = (p: "AM" | "PM") => {
      onChange?.(hour, minute, p);
    };

    return (
      <div ref={ref} className={`ds-time-picker ${className}`.trim()} {...rest}>
        {/* Hour spinner */}
        <div className="ds-time-picker__spinner">
          <button type="button" className="ds-time-picker__arrow" onClick={() => adjustHour(1)} aria-label="Aumentar hora">
            <ChevronUpIcon />
          </button>
          <div className="ds-time-picker__value">{String(hour).padStart(2, "0")}</div>
          <button type="button" className="ds-time-picker__arrow" onClick={() => adjustHour(-1)} aria-label="Disminuir hora">
            <ChevronDownIcon />
          </button>
        </div>

        <span className="ds-time-picker__sep">:</span>

        {/* Minute spinner */}
        <div className="ds-time-picker__spinner">
          <button type="button" className="ds-time-picker__arrow" onClick={() => adjustMinute(1)} aria-label="Aumentar minuto">
            <ChevronUpIcon />
          </button>
          <div className="ds-time-picker__value">{String(minute).padStart(2, "0")}</div>
          <button type="button" className="ds-time-picker__arrow" onClick={() => adjustMinute(-1)} aria-label="Disminuir minuto">
            <ChevronDownIcon />
          </button>
        </div>

        {/* Period toggle */}
        <div className="ds-time-picker__period">
          <button
            type="button"
            className={`ds-time-picker__period-btn ${period === "AM" ? "ds-time-picker__period-btn--active" : ""}`}
            onClick={() => togglePeriod("AM")}
          >
            AM
          </button>
          <button
            type="button"
            className={`ds-time-picker__period-btn ${period === "PM" ? "ds-time-picker__period-btn--active" : ""}`}
            onClick={() => togglePeriod("PM")}
          >
            PM
          </button>
        </div>
      </div>
    );
  },
);

TimePicker.displayName = "TimePicker";

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
