import { type FC, useEffect, useState } from "react";

import type { DataMap } from "../types";
import { MONTH_NAMES } from "../utils/dateHelpers";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { CalendarGrid, DayDetailsDrawer, StatsBar } from "..";
import apiClient from "@/api/ApiClient";

const CalendarBody: FC = () => {
  const today = new Date();

  const [year, setYear] = useState<number>(() => today.getFullYear());
  const [month, setMonth] = useState<number>(() => today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [dataMap, setDataMap] = useState<DataMap>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const api = import.meta.env.VITE_API_URL;
    const id = localStorage.getItem("id");

    try {
      setLoading(true);
      const res = await apiClient.get(`${api}/learning-centers/${id}/calendar`, {
        params: {
          year,
          month: month + 1,
        },
      });

      setDataMap(res.data.data ?? {});
    } catch (error) {
      console.log(error);
      setDataMap({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

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
    } else {
      setMonth((m) => m - 1);
    }
    handleCloseDrawer();
  };

  const handleNextMonth = (): void => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    handleCloseDrawer();
  };

  const handleToday = (): void => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDay(now.getDate());
    setDrawerOpen(false);
  };

  return (
    <div className="font-sans transition-colors duration-300">
      <main className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {MONTH_NAMES[month]}{" "}
              <span className="font-light text-slate-400 dark:text-slate-500">
                {year}
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Kalendar hozirgi vaqt bo'yicha avtomatik yangilanadi.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              onClick={handleToday}
              className="inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 dark:shadow-indigo-950"
            >
              Bugun
            </button>

            <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={handlePrevMonth}
                className="cursor-pointer px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronLeftIcon />
              </button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <button
                onClick={handleNextMonth}
                className="cursor-pointer px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>

        <StatsBar data={dataMap} loading={loading} year={year} month={month} />

        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4 lg:p-5">
          <CalendarGrid
            year={year}
            loading={loading}
            month={month}
            data={dataMap}
            selectedDay={selectedDay}
            onDayClick={handleDayClick}
          />
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
          Batafsil ma'lumotni ko'rish uchun istalgan sanani tanlang
        </p>
      </main>

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
