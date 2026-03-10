import type { FC } from "react";
import type { DataMap, PillItem } from "../types";
import { toDateStr } from "../utils/dateHelpers";
import { EventPill } from "..";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface CalendarDayProps {
  day: number;
  year: number;
  month: number;
  /** Full data map keyed by "YYYY-MM-DD". */
  data: DataMap;
  /** Whether this cell represents today's date. */
  isToday: boolean;
  /** Whether this cell is currently selected (drawer open). */
  isSelected: boolean;
  onClick: (day: number) => void;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

/**
 * CalendarDay
 *
 * A single cell in the monthly grid. Displays the day number,
 * colored dot indicators, and up to 2 event pills (+ overflow count).
 * Highlights today with an indigo circle and selected days with a
 * border + background tint.
 */
const CalendarDay: FC<CalendarDayProps> = ({
  day,
  year,
  month,
  data,
  isToday,
  isSelected,
  onClick,
}) => {
  const dateStr = toDateStr(year, month, day);
  const dayData = data[dateStr];

  const hasEvents =
    !!dayData &&
    (dayData.lessons.length > 0 ||
      dayData.payments.length > 0 ||
      dayData.birthdays.length > 0);

  const totalEvents = dayData
    ? dayData.lessons.length + dayData.payments.length + dayData.birthdays.length
    : 0;

  // Build up to 2 pills: lesson first, then payment, then birthday
  const pills: PillItem[] = [];
  if (dayData) {
    dayData.lessons.slice(0, 1).forEach((l) =>
      pills.push({ type: "lesson", label: l.name.split(" ").slice(0, 2).join(" ") })
    );
    if (pills.length < 2) {
      dayData.payments.slice(0, 1).forEach((p) =>
        pills.push({ type: "payment", label: `$${p.paidAmount}` })
      );
    }
    if (pills.length < 2) {
      dayData.birthdays.slice(0, 1).forEach((b) =>
        pills.push({ type: "birthday", label: `🎂 ${b.fullName}` })
      );
    }
  }
  const overflow = totalEvents - pills.length;

  return (
    <div
      onClick={() => onClick(day)}
      className={`
        relative flex flex-col min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2
        rounded-xl cursor-pointer border transition-all duration-200 select-none group
        ${
          isSelected
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30"
            : "border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-slate-900/40"
        }
      `}
    >
      {/* ── Day number + dot indicators ── */}
      <div className="flex items-center justify-between mb-1 flex-col sm:flex-row">
        <span
          className={`
            inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7
            rounded-full text-xs sm:text-sm font-semibold transition-all
            ${
              isToday
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-300 dark:shadow-indigo-900"
                : isSelected
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
            }
          `}
        >
          {day}
        </span>

        {hasEvents && (
          <span className="flex gap-0.5 flex-col justify-between sm:flex-row">
            {dayData!.lessons.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
            {dayData!.payments.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
            {dayData!.birthdays.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </span>
        )}
      </div>

      {/* ── Event pills ── */}
      <div className="flex-col gap-0.5 overflow-hidden hidden sm:flex">
        {pills.map((p, i) => (
          <EventPill key={i} type={p.type} label={p.label} />
        ))}
        {overflow > 0 && (
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium pl-0.5">
            +{overflow} yana
          </span>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;