import type { FC, ReactNode } from "react";
import type { DataMap } from "../types";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  DAY_LABELS,
} from "../utils/dateHelpers";
import { CalendarDay } from "..";

interface CalendarGridProps {
  year: number;
  month: number;
  data: DataMap;
  selectedDay: number | null;
  onDayClick: (day: number) => void;
  loading: boolean;
}

const CalendarGrid: FC<CalendarGridProps> = ({
  year,
  month,
  data,
  selectedDay,
  loading,
  onDayClick,
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const cells: ReactNode[] = [];

  // ── Skeleton loading ─────────────────────
  if (loading) {
    return (
      <div>
        {/* Weekday labels */}
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

        {/* Skeleton cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="h-16 sm:h-24 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Empty placeholders ───────────────────
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  // ── Day cells ────────────────────────────
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
      />,
    );
  }

  return (
    <div>
      {/* Weekday header */}
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

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">{cells}</div>
    </div>
  );
};

export default CalendarGrid;
