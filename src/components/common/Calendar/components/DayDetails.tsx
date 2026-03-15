import { type FC } from "react";
import type { DataMap, DayData } from "../types";
import { MONTH_NAMES, toDateStr } from "../utils/dateHelpers";
import {
  XIcon,
  CalendarIcon,
  GraduationCapIcon,
  CreditCardIcon,
  CakeIcon,
} from "../icons";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface DayDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Selected day number (1–31), or null when nothing is selected. */
  selectedDay: number | null;
  year: number;
  month: number;
  /** Full data map keyed by "YYYY-MM-DD". */
  data: DataMap;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

/**
 * DayDetailsDrawer
 *
 * Shows full event details for the clicked calendar date.
 *
 * Layout:
 *  • Desktop  → fixed left sidebar (slides in from the left)
 *  • Mobile   → bottom sheet (slides up from the bottom)
 *
 * Sections: Lessons · Payments · Birthdays
 * Each section renders a header with an icon + count badge,
 * followed by styled cards for every entry.
 */
const DayDetailsDrawer: FC<DayDetailsDrawerProps> = ({
  isOpen,
  onClose,
  selectedDay,
  year,
  month,
  data,
}) => {
  if (!selectedDay) return null;

  const dateStr = toDateStr(year, month, selectedDay);
  const dayData: DayData = data[dateStr] ?? {
    date: dateStr,
    lessons: [],
    payments: [],
    birthdays: [],
  };

  const hasAny =
    dayData.lessons.length ||
    dayData.payments.length ||
    dayData.birthdays.length;

  const WEEKDAYS_UZ = [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];

  const dayName = WEEKDAYS_UZ[new Date(year, month, selectedDay).getDay()];
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`
        fixed z-40
        bg-white dark:bg-slate-900 shadow-2xl
        transition-transform duration-300 ease-out

        /* mobile bottom sheet */
        bottom-0 left-0 right-0
        rounded-t-2xl max-h-[75vh] overflow-y-auto

        /* desktop right sidebar */
        sm:bottom-auto sm:top-16 sm:right-0 sm:left-auto
        sm:h-full sm:w-80
        sm:rounded-none sm:rounded-l-2xl

        border-t sm:border-t-0 sm:border-l
        border-slate-200 dark:border-slate-700/60

        ${
          isOpen
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full"
        }
      `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-start justify-between z-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-0.5">
              {dayName}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[month]} {selectedDay}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {year}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-1 cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-6">
          {!hasAny && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                <CalendarIcon />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Bu kunga hech qanday reja kiritilmagan.
              </p>
            </div>
          )}

          {/* Lessons */}
          {dayData.lessons.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <GraduationCapIcon />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Darslar
                </h3>
                <span className="ml-auto text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {dayData.lessons.length}
                </span>
              </div>

              <div className="space-y-2">
                {dayData.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50"
                  >
                    <div className="w-1 self-stretch rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {lesson.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        ⏰ {lesson.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Payments */}
          {dayData.payments.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CreditCardIcon />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  To'lovlar
                </h3>
              </div>

              <div className="space-y-2">
                {dayData.payments.map((payment, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50"
                  >
                    <div className="w-1 self-stretch rounded-full bg-emerald-500" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {payment.student.fullName}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        {Number(payment.amount).toLocaleString()} / {Number(payment.paidAmount).toLocaleString()} UZS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Birthdays */}
          {dayData.birthdays.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <CakeIcon />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Tug'ilgan Kunlar
                </h3>
              </div>

              <div className="space-y-2">
                {dayData.birthdays.map((birthday, i) => (
                  <Link
                    to={`/student-info/${birthday.id}`}
                    key={i}
                    className="flex items-center group gap-3 p-3 rounded-xl justify-between bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1 self-stretch rounded-full bg-amber-500" />
                      <span>🎂</span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {birthday.fullName}
                      </p>
                    </div>
                    <div className="hidden group-hover:flex">
                      <ChevronRight strokeWidth={2} className="text-amber-500/50"/>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};
export default DayDetailsDrawer;
