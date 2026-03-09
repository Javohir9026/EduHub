import { type FC } from "react";

// ─── COMPONENT ────────────────────────────────────────────────────────────────

/**
 * Legend
 *
 * A small horizontal strip showing colored dot + label pairs
 * for the three event categories: Lessons, Payments, Birthdays.
 * Displayed in the top navigation bar.
 */
const Legend: FC = () => {
  const items = [
    { color: "bg-blue-500",    label: "Lessons" },
    { color: "bg-emerald-500", label: "Payments" },
    { color: "bg-amber-500",   label: "Birthdays" },
  ];

  return (
    <div className="flex items-center gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${item.color}`} />
          <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;