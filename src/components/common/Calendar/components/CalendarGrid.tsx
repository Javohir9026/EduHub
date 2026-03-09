import type { FC, ReactNode } from "react";
import type { DataMap } from "../types";
import { getDaysInMonth, getFirstDayOfMonth, DAY_LABELS } from "../utils/dateHelpers";
import { CalendarDay } from "..";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface CalendarGridProps {
  year: number;
  month: number;
  /** Full data map keyed by "YYYY-MM-DD". */
  data: DataMap;
  /** Currently selected day number, or null if none. */
  selectedDay: number | null;
  onDayClick: (day: number) => void;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

/**
 * CalendarGrid
 *
 * Renders the 7-column monthly grid: a row of weekday labels followed by
 * individual CalendarDay cells. Leading empty cells are injected so
 * the 1st lands on the correct weekday column.
 */
const CalendarGrid: FC<CalendarGridProps> = ({
  year,
  month,
  data,
  selectedDay,
  onDayClick,
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  // Build cell array: empty placeholders + day cells
  const cells: ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      <CalendarDay
        key={d}
        day={d}
        year={year}
        month={month}
        data={data}
        isToday={isCurrentMonth && d === today.getDate()}
        isSelected={d === selectedDay}
        onClick={onDayClick}
      />
    );
  }

  return (
    <div>
      {/* ── Weekday header row ── */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Day cells ── */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">{cells}</div>
    </div>
  );
};

export default CalendarGrid;