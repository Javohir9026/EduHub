import { type FC } from "react";
import { type EventType } from "../types";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface EventPillProps {
  /** Which event category this pill represents — determines color. */
  type: EventType;
  /** Short label text shown inside the pill. */
  label: string;
}

// ─── COLOR MAP ────────────────────────────────────────────────────────────────

const PILL_STYLES: Record<EventType, string> = {
  lesson:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  payment:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  birthday:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

/**
 * EventPill
 *
 * A small color-coded label displayed inside a calendar day cell
 * to represent a lesson, payment, or birthday event at a glance.
 */
const EventPill: FC<EventPillProps> = ({ type, label }) => (
  <span
    className={`
      inline-flex items-center gap-1 px-1.5 py-0.5 rounded
      text-[10px] font-medium leading-tight truncate max-w-full
      ${PILL_STYLES[type]}
    `}
  >
    {label}
  </span>
);

export default EventPill;
