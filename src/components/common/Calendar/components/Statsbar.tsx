import type { FC } from "react";
import { type DataMap, type StatItem } from "../types";

// ─── PROPS ───────────────────────────────────────────────────

interface StatsBarProps {
  data: DataMap;
  year: number;
  month: number;
  loading: boolean;
}

// ─── COMPONENT ───────────────────────────────────────────────

const StatsBar: FC<StatsBarProps> = ({ data, year, month, loading }) => {
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
      value: `${revenue} so'm`,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
    },
  ];

  // ── Skeleton Loader ────────────────────────────────────────

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900"
          >
            <div className="h-3 w-20 mb-2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-6 w-16 rounded bg-slate-300 dark:bg-slate-600 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // ── Normal UI ──────────────────────────────────────────────

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border px-4 py-3 ${stat.bg} border-slate-200 dark:border-slate-800`}
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
