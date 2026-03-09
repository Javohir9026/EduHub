import type { FC } from "react";
import { type DataMap, type StatItem } from "../types";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface StatsBarProps {
  data: DataMap;
  year: number;
  month: number;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

/**
 * StatsBar
 *
 * Displays four summary cards at the top of the calendar page:
 * total lessons, payments, birthdays, and combined revenue
 * for the currently visible month.
 */
const StatsBar: FC<StatsBarProps> = ({ data, year, month }) => {
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  let lessons = 0;
  let payments = 0;
  let birthdays = 0;
  let revenue = 0;

  Object.entries(data).forEach(([date, d]) => {
    if (date.startsWith(monthStr)) {
      lessons += d.lessons.length;
      payments += d.payments.length;
      birthdays += d.birthdays.length;
      revenue += d.payments.reduce((sum, p) => sum + p.amount, 0);
    }
  });

  const stats: StatItem[] = [
    {
      label: "Darslar",
      value: lessons,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "To'lovlar",
      value: payments,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "Tug'ilgan kunlar",
      value: birthdays,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "Daromad",
      value: `$${revenue}`,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl px-4 py-3 ${stat.bg} border border-slate-100 dark:border-slate-800`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            {stat.label}
          </p>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;