import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/ApiClient";

// ================== TYPES ==================

type Overview = {
  groupCount: number;
  activeGroupCount: number;
  studentCount: number;
  lessonCount: number;
  todayLessons: number;
  upcomingLessons: number;
};

type Attendance = {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
};

type Lesson = {
  id: number;
  name: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  group: { id: number; name: string };
};

type StatsResponse = {
  overview: Overview;
  attendance: Attendance;
  recentLessons: Lesson[];
};

// ================== API ==================

async function fetchStats(): Promise<StatsResponse> {
  const token = localStorage.getItem("access_token");
  const api = import.meta.env.VITE_API_URL;
  const teacherId = localStorage.getItem("id");

  const res = await apiClient.get<{ data: StatsResponse }>(
    `${api}/teachers/${teacherId}/statistics`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data.data;
}

// ================== COUNT ANIMATION ==================

function CountUp({ target, active }: { target: number; active: boolean }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;
    let current = 0;
    const steps = 45;
    const increment = Math.ceil(target / steps);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setVal(target);
        clearInterval(interval);
      } else {
        setVal(current);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [target, active]);

  return <>{val.toLocaleString("uz-UZ")}</>;
}

// ================== SKELETON ==================

function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 bg-[length:400%_100%] animate-[shimmer_1.4s_ease-in-out_infinite] ${className}`}
    />
  );
}

function SkeletonStatCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-zinc-800">
      <SkeletonPulse className="w-11 h-11 mb-4" />
      <SkeletonPulse className="w-20 h-8 mb-2" />
      <SkeletonPulse className="w-28 h-4" />
    </div>
  );
}

function SkeletonPanel({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-zinc-800">
      <SkeletonPulse className="w-44 h-5 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-zinc-800">
            <div className="space-y-2">
              <SkeletonPulse className="w-32 h-4" />
              <SkeletonPulse className="w-20 h-3" />
            </div>
            <div className="space-y-2 items-end flex flex-col">
              <SkeletonPulse className="w-20 h-4" />
              <SkeletonPulse className="w-24 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================== CARDS CONFIG ==================

const CARDS: {
  key: keyof Overview;
  icon: string;
  label: string;
  accent: string;
  iconBg: string;
  shadow: string;
  border: string;
  topBar: string;
}[] = [
  {
    key: "studentCount",
    icon: "👨‍🎓",
    label: "O'quvchilar",
    accent: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-950",
    shadow: "shadow-[0_4px_20px_rgba(99,102,241,0.12)] dark:shadow-[0_4px_20px_rgba(99,102,241,0.08)]",
    border: "border-indigo-100 dark:border-indigo-900",
    topBar: "from-indigo-400 to-indigo-600",
  },
  {
    key: "groupCount",
    icon: "📚",
    label: "Guruhlar",
    accent: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    shadow: "shadow-[0_4px_20px_rgba(16,185,129,0.12)] dark:shadow-[0_4px_20px_rgba(16,185,129,0.08)]",
    border: "border-emerald-100 dark:border-emerald-900",
    topBar: "from-emerald-400 to-emerald-600",
  },
  {
    key: "todayLessons",
    icon: "📅",
    label: "Bugungi darslar",
    accent: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    shadow: "shadow-[0_4px_20px_rgba(245,158,11,0.12)] dark:shadow-[0_4px_20px_rgba(245,158,11,0.08)]",
    border: "border-amber-100 dark:border-amber-900",
    topBar: "from-amber-400 to-amber-600",
  },
  {
    key: "lessonCount",
    icon: "📖",
    label: "Jami darslar",
    accent: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-50 dark:bg-violet-950",
    shadow: "shadow-[0_4px_20px_rgba(139,92,246,0.12)] dark:shadow-[0_4px_20px_rgba(139,92,246,0.08)]",
    border: "border-violet-100 dark:border-violet-900",
    topBar: "from-violet-400 to-violet-600",
  },
];

// ================== ATTENDANCE BAR ==================

function AttendanceBar({ rate }: { rate: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(rate), 300);
    return () => clearTimeout(t);
  }, [rate]);

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-zinc-500 mb-1.5">
        <span>Davomat darajasi</span>
        <span className="text-indigo-600 dark:text-indigo-400">{rate}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-zinc-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-indigo-600 transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ================== MAIN ==================

export default function DashboardStats() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setVisible(false);

    try {
      const result = await fetchStats();
      setData(result);
      setTimeout(() => setVisible(true), 80);
    } catch {
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 font-semibold mt-0.5">
            Umumiy ko'rsatkichlar
          </p>
        </div>
        {!loading && (
          <button
            onClick={load}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition px-4 py-2 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 1019.364 5" />
            </svg>
            Yangilash
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center justify-between bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            onClick={load}
            className="text-sm font-bold underline underline-offset-2 hover:opacity-70 transition"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {loading
          ? [1, 2, 3, 4].map((i) => <SkeletonStatCard key={i} />)
          : CARDS.map((card, idx) => (
              <div
                key={card.key}
                className={`
                  relative rounded-2xl bg-white dark:bg-fullbg border overflow-hidden
                  ${card.shadow} ${card.border}
                  transition-all duration-300 hover:-translate-y-1
                  hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                {/* Accent top bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${card.topBar}`} />

                <div className="p-5">
                  <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center text-xl mb-4`}>
                    {card.icon}
                  </div>

                  <div className={`text-4xl font-black tracking-tight leading-none mb-2 ${card.accent}`}>
                    <CountUp target={data?.overview?.[card.key] ?? 0} active={visible} />
                  </div>

                  <p className="text-xs font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                    {card.label}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Attendance */}
        {loading ? (
          <div className="lg:col-span-2"><SkeletonPanel rows={1} /></div>
        ) : (
          data?.attendance && (
            <div
              className={`
                lg:col-span-2 rounded-2xl bg-white dark:bg-fullbg border border-slate-100 dark:border-zinc-800 p-6
                shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                transition-all duration-500
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{ transitionDelay: "280ms" }}
            >
              <h2 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 mb-5 flex items-center gap-2">
                📊 <span>Davomat statistikasi</span>
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {/* Present */}
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 p-3.5 text-center">
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none mb-1">
                    {data.attendance.presentCount}
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-400 dark:text-emerald-600 uppercase tracking-wide">
                    Kelgan
                  </p>
                </div>

                {/* Absent */}
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-100 dark:border-rose-900 p-3.5 text-center">
                  <p className="text-2xl font-black text-rose-500 dark:text-rose-400 leading-none mb-1">
                    {data.attendance.absentCount}
                  </p>
                  <p className="text-[10px] font-extrabold text-rose-400 dark:text-rose-600 uppercase tracking-wide">
                    Kelmagan
                  </p>
                </div>

                {/* Rate */}
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 p-3.5 text-center">
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none mb-1">
                    {data.attendance.attendanceRate}%
                  </p>
                  <p className="text-[10px] font-extrabold text-indigo-400 dark:text-indigo-600 uppercase tracking-wide">
                    Foiz
                  </p>
                </div>
              </div>

              <AttendanceBar rate={data.attendance.attendanceRate} />

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-zinc-500">
                <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-600" />
                Jami yozuvlar:{" "}
                <span className="text-slate-600 dark:text-zinc-300 font-bold">
                  {data.attendance.totalRecords}
                </span>
              </div>
            </div>
          )
        )}

        {/* Recent Lessons */}
        {loading ? (
          <div className="lg:col-span-3"><SkeletonPanel rows={4} /></div>
        ) : (
          <div
            className={`
              lg:col-span-3 rounded-2xl bg-white dark:bg-fullbg border border-slate-100 dark:border-zinc-800 p-6
              shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
              transition-all duration-500
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
            style={{ transitionDelay: "350ms" }}
          >
            <h2 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 mb-5 flex items-center gap-2">
              📖 <span>So'nggi darslar</span>
            </h2>

            {!data?.recentLessons?.length ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-300 dark:text-zinc-600">
                <span className="text-5xl mb-3">📭</span>
                <p className="font-bold text-sm">Ma'lumot yo'q</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.recentLessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className={`
                      flex items-center justify-between
                      px-4 py-3.5 rounded-xl
                      bg-slate-50 hover:bg-indigo-50
                      dark:bg-slate-900 dark:hover:bg-zinc-700
                      border border-slate-100 hover:border-indigo-100
                      dark:border-zinc-700 dark:hover:border-zinc-600
                      transition-all duration-200 cursor-default
                      ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}
                    `}
                    style={{ transitionDelay: `${400 + idx * 60}ms` }}
                  >
                    {/* Left: dot + info */}
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-300 dark:bg-indigo-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 leading-tight">
                          {lesson.name}
                        </p>
                        <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mt-0.5">
                          {lesson.group.name}
                        </p>
                      </div>
                    </div>

                    {/* Right: date + time */}
                    <div className="flex items-center gap-3 text-right flex-shrink-0">
                      <span className="hidden sm:inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 px-2.5 py-1 rounded-lg">
                        {lesson.lessonDate}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                        {lesson.startTime} – {lesson.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}