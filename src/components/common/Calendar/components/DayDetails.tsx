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

interface DayDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number | null;
  year: number;
  month: number;
  data: DataMap;
}

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
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs transition-opacity duration-300 dark:bg-slate-950/40 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`
          fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-slate-900
          bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-slate-200 dark:border-slate-700/60
          sm:left-auto sm:right-4 sm:top-20 sm:bottom-auto sm:w-[min(42rem,calc(100vw-2rem))] sm:max-h-[calc(100vh-6rem)]
          sm:rounded-2xl sm:border sm:border-slate-200 dark:sm:border-slate-700/60
          ${
            isOpen
              ? "translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-y-0 sm:translate-x-[110%]"
          }
        `}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
              {dayName}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[month]} {selectedDay}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{year}</p>
          </div>

          <button
            onClick={onClose}
            className="mt-1 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <XIcon />
          </button>
        </div>

        <div className="space-y-6 px-5 py-5 lg:px-6">
          {!hasAny && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <CalendarIcon />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Bu kunga hech qanday reja kiritilmagan.
              </p>
            </div>
          )}

          {dayData.lessons.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                  <GraduationCapIcon />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                  Darslar
                </h3>
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                  {dayData.lessons.length}
                </span>
              </div>

              <div className="space-y-2">
                {dayData.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/30"
                  >
                    <div className="w-1 self-stretch rounded-full bg-blue-500" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {lesson.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {lesson.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {dayData.payments.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <CreditCardIcon />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                  To'lovlar
                </h3>
              </div>

              <div className="space-y-2">
                {dayData.payments.map((payment, i) => (
                  <Link
                    to={`/payment-info/${payment.id}`}
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 transition hover:bg-emerald-100/70 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50"
                  >
                    <div className="w-1 self-stretch rounded-full bg-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {payment.student.fullName}
                      </p>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {Number(payment.amount).toLocaleString()} /{" "}
                        {Number(payment.paidAmount).toLocaleString()} UZS
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {dayData.birthdays.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <CakeIcon />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                  Tug'ilgan Kunlar
                </h3>
              </div>

              <div className="space-y-2">
                {dayData.birthdays.map((birthday, i) => (
                  <Link
                    to={`/student-info/${birthday.id}`}
                    key={i}
                    className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3 transition hover:bg-amber-100/70 dark:border-amber-900/50 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="w-1 self-stretch rounded-full bg-amber-500" />
                      <span className="shrink-0">🎂</span>
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {birthday.fullName}
                      </p>
                    </div>
                    <div className="hidden group-hover:flex">
                      <ChevronRight strokeWidth={2} className="text-amber-500/50" />
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
