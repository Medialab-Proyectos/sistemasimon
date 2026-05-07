import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";

/* ──────────────────────────────────────────────
 * Design System SM — Calendar (Organism)
 *
 * Figma specs:
 *   Variants: day | month | datetime
 *   Day: 7-column grid, selectable days
 *   Month: 3-column grid, selectable months
 *   DateTime: day grid + time inputs (hour, minute, AM/PM)
 *   Selected: brand-400 bg, white text
 *   Today: brand-50 bg, brand-800 text
 *   Disabled days: neutral-300 text, no pointer
 *   Container: white bg, radius-sm, shadow-sm, border neutral-200
 * ────────────────────────────────────────────── */

export type CalendarVariant = "day" | "month" | "datetime";

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  variant?: CalendarVariant;
  value?: Date;
  today?: Date;
  month?: number;
  year?: number;
  disabledDates?: Date[];
  rangeStart?: Date;
  rangeEnd?: Date;
  hour?: number;
  minute?: number;
  period?: "AM" | "PM";
  locale?: string;
  footer?: ReactNode;
  onChange?: (date: Date) => void;
  onMonthChange?: (month: number, year: number) => void;
  onTimeChange?: (hour: number, minute: number, period: "AM" | "PM") => void;
}

const WEEKDAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, start?: Date, end?: Date) {
  if (!start || !end) return false;
  return date > start && date < end;
}

function isDisabled(date: Date, disabledDates?: Date[]) {
  return disabledDates?.some(d => isSameDay(d, date)) ?? false;
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      variant = "day",
      value,
      today = new Date(),
      month: controlledMonth,
      year: controlledYear,
      disabledDates,
      rangeStart,
      rangeEnd,
      hour: controlledHour = 12,
      minute: controlledMinute = 0,
      period: controlledPeriod = "AM",
      locale = "es",
      footer,
      onChange,
      onMonthChange,
      onTimeChange,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [internalMonth, setInternalMonth] = useState(controlledMonth ?? today.getMonth());
    const [internalYear, setInternalYear] = useState(controlledYear ?? today.getFullYear());

    const currentMonth = controlledMonth ?? internalMonth;
    const currentYear = controlledYear ?? internalYear;

    const navigateMonth = (delta: number) => {
      let newMonth = currentMonth + delta;
      let newYear = currentYear;
      if (newMonth < 0) { newMonth = 11; newYear--; }
      if (newMonth > 11) { newMonth = 0; newYear++; }
      setInternalMonth(newMonth);
      setInternalYear(newYear);
      onMonthChange?.(newMonth, newYear);
    };

    const navigateYear = (delta: number) => {
      const newYear = currentYear + delta;
      setInternalYear(newYear);
      onMonthChange?.(currentMonth, newYear);
    };

    const handleDayClick = (day: number) => {
      const date = new Date(currentYear, currentMonth, day);
      if (!isDisabled(date, disabledDates)) {
        onChange?.(date);
      }
    };

    const handleMonthClick = (monthIdx: number) => {
      setInternalMonth(monthIdx);
      onMonthChange?.(monthIdx, currentYear);
    };

    // Build day grid
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
    const days: { day: number; outside: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, outside: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, outside: false });
    }
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, outside: true });
      }
    }

    return (
      <div
        ref={ref}
        className={`ds-calendar ${className}`.trim()}
        {...rest}
      >
        {/* Header */}
        <div className="ds-calendar__header">
          <button type="button" className="ds-calendar__nav" onClick={() => variant === "month" ? navigateYear(-1) : navigateMonth(-1)} aria-label="Anterior">
            <ChevronLeftIcon />
          </button>
          <span className="ds-calendar__title">
            {variant === "month" ? currentYear : `${MONTHS_ES[currentMonth]} ${currentYear}`}
          </span>
          <button type="button" className="ds-calendar__nav" onClick={() => variant === "month" ? navigateYear(1) : navigateMonth(1)} aria-label="Siguiente">
            <ChevronRightIcon />
          </button>
        </div>

        {/* Day grid */}
        {(variant === "day" || variant === "datetime") && (
          <>
            <div className="ds-calendar__weekdays">
              {WEEKDAYS_ES.map(wd => (
                <span key={wd} className="ds-calendar__weekday">{wd}</span>
              ))}
            </div>
            <div className="ds-calendar__grid">
              {days.map((d, i) => {
                const date = d.outside
                  ? new Date(currentYear, currentMonth, d.day) // approximate
                  : new Date(currentYear, currentMonth, d.day);
                const isSelected = value && !d.outside && isSameDay(date, value);
                const isToday = !d.outside && isSameDay(date, today);
                const inRange = !d.outside && isInRange(date, rangeStart, rangeEnd);
                const isRangeStart = rangeStart && !d.outside && isSameDay(date, rangeStart);
                const isRangeEnd = rangeEnd && !d.outside && isSameDay(date, rangeEnd);
                const disabled = d.outside || isDisabled(date, disabledDates);

                let cls = "ds-calendar__day";
                if (d.outside) cls += " ds-calendar__day--outside";
                if (isToday && !isSelected) cls += " ds-calendar__day--today";
                if (isSelected) cls += " ds-calendar__day--selected";
                if (inRange) cls += " ds-calendar__day--range";
                if (isRangeStart) cls += " ds-calendar__day--range-start";
                if (isRangeEnd) cls += " ds-calendar__day--range-end";
                if (disabled) cls += " ds-calendar__day--disabled";

                return (
                  <button
                    key={i}
                    type="button"
                    className={cls}
                    disabled={disabled}
                    onClick={() => !d.outside && handleDayClick(d.day)}
                    tabIndex={d.outside ? -1 : 0}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Month grid */}
        {variant === "month" && (
          <div className="ds-calendar__months">
            {MONTHS_ES.map((m, i) => {
              let cls = "ds-calendar__month";
              if (value && value.getMonth() === i && value.getFullYear() === currentYear) {
                cls += " ds-calendar__month--selected";
              } else if (today.getMonth() === i && today.getFullYear() === currentYear) {
                cls += " ds-calendar__month--current";
              }
              return (
                <button
                  key={m}
                  type="button"
                  className={cls}
                  onClick={() => handleMonthClick(i)}
                >
                  {m.slice(0, 3)}
                </button>
              );
            })}
          </div>
        )}

        {/* Time section */}
        {variant === "datetime" && (
          <div className="ds-calendar__time">
            <input
              type="text"
              className="ds-calendar__time-input"
              value={String(controlledHour).padStart(2, "0")}
              onChange={e => {
                const h = parseInt(e.target.value, 10);
                if (!isNaN(h) && h >= 1 && h <= 12) onTimeChange?.(h, controlledMinute, controlledPeriod);
              }}
              maxLength={2}
              aria-label="Hora"
            />
            <span className="ds-calendar__time-sep">:</span>
            <input
              type="text"
              className="ds-calendar__time-input"
              value={String(controlledMinute).padStart(2, "0")}
              onChange={e => {
                const m = parseInt(e.target.value, 10);
                if (!isNaN(m) && m >= 0 && m <= 59) onTimeChange?.(controlledHour, m, controlledPeriod);
              }}
              maxLength={2}
              aria-label="Minuto"
            />
            <div className="ds-calendar__time-period">
              <button
                type="button"
                className={`ds-calendar__time-period-btn ${controlledPeriod === "AM" ? "ds-calendar__time-period-btn--active" : ""}`}
                onClick={() => onTimeChange?.(controlledHour, controlledMinute, "AM")}
              >
                AM
              </button>
              <button
                type="button"
                className={`ds-calendar__time-period-btn ${controlledPeriod === "PM" ? "ds-calendar__time-period-btn--active" : ""}`}
                onClick={() => onTimeChange?.(controlledHour, controlledMinute, "PM")}
              >
                PM
              </button>
            </div>
          </div>
        )}

        {footer && <div className="ds-calendar__footer">{footer}</div>}
      </div>
    );
  },
);

Calendar.displayName = "Calendar";

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
