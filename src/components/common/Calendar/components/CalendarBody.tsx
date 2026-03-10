import { type FC, useState, useMemo, useEffect } from "react";

import type { DataMap, DayData } from "../types";
import { MONTH_NAMES } from "../utils/dateHelpers";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { CalendarGrid, DayDetailsDrawer, StatsBar } from "..";
import apiClient from "@/api/ApiClient";

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const CalendarBody: FC = () => {
  const today = new Date();

  // ── State ──────────────────────────────────────────────────────────────────
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(2); // 0-indexed; 2 = March
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [dataMap, setDataMap] = useState<DataMap>({});
  const [loading, setLoading] = useState(false)
  // fetchdata

  const fetchData = async () => {
    const api = import.meta.env.VITE_API_URL;
    const id = localStorage.getItem("id");

    try {
      setLoading(true)
      const res = await apiClient.get(
        `${api}/learning-centers/${id}/calendar`,
        {
          params: {
            year: year,
            month: month + 1,
          },
        },
      );

      setDataMap(res.data.data);
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDayClick = (day: number): void => {
    setSelectedDay(day);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = (): void => {
    setDrawerOpen(false);
    setSelectedDay(null);
  };

  const handlePrevMonth = (): void => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    handleCloseDrawer();
  };

  const handleNextMonth = (): void => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    handleCloseDrawer();
  };

  const handleToday = (): void => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    handleCloseDrawer();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background transition-colors duration-300 font-sans">
      {/* ── Page body ── */}
      <main className="max-w-7xl mx-auto">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {MONTH_NAMES[month]}{" "}
              <span className="text-slate-400 dark:text-slate-500 font-light">
                {year}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Today shortcut */}
            <button
              onClick={handleToday}
              className=" cursor-pointer hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
            >
              Bugun
            </button>

            {/* Prev / Next */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
              <button
                onClick={handlePrevMonth}
                className="cursor-pointer px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeftIcon />
              </button>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
              <button
                onClick={handleNextMonth}
                className="px-3 py-2 cursor-pointer text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Monthly stats summary */}
        <StatsBar data={dataMap} loading={loading} year={year} month={month} />

        {/* Calendar grid card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
          <CalendarGrid
            year={year}
            loading={loading}
            month={month}
            data={dataMap}
            selectedDay={selectedDay}
            onDayClick={handleDayClick}
          />
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-4">
          Batafsil ma'lumotni ko'rish uchun istalgan sanani tanlang
        </p>
      </main>

      {/* Day detail drawer (left sidebar / bottom sheet) */}
      <DayDetailsDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        selectedDay={selectedDay}
        year={year}
        month={month}
        data={dataMap}
      />
    </div>
  );
};

export default CalendarBody;
