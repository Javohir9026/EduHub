import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/ApiClient";
import {
  ArrowRight,
  Users,
  Clock,
  CalendarDays,
  GraduationCap,
  BookOpen,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Group = {
  id: number;
  name: string;
  currentStudents: number;
  lessonDays: number;
  lessonTime: string;
  teacher: {
    firstName: string;
    lastName: string;
  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDayLabel(days: number) {
  if (days === 7) return "Har kuni";
  if (days >= 5) return `${days} marta / hafta`;
  if (days === 1) return "Haftada 1 marta";
  return `${days} marta / hafta`;
}

function getCapacityStyle(students: number) {
  if (students >= 20)
    return "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
  if (students >= 14)
    return "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  return "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyGroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;
        const res = await apiClient.get(`${api}/groups/teacher/my-groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data?.data || res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const avatarLetter = (g: Group) =>
    g.teacher?.firstName?.[0] ?? g.teacher?.lastName?.[0] ?? "?";

  const teacherName = (g: Group) =>
    `${g.teacher?.firstName ?? ""} ${g.teacher?.lastName ?? ""}`.trim() || "—";

  /* ── LOADING ── */
  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] tracking-widest font-semibold">
                {["#", "Guruh nomi", "O'quvchilar", "Kunlar", "Vaqt", "O'qituvchi", "Amal"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {["24px", "120px", "60px", "80px", "72px", "110px", "88px"].map((w, j) => (
                    <td key={j} className="px-5 py-4">
                      <div
                        className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                        style={{ width: w }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile skeleton */}
        <div className="md:hidden flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 animate-pulse"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="h-5 w-32 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                <div className="h-7 w-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((__, j) => (
                  <div key={j} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  /* ── ERROR ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center mb-4">
          <AlertCircle className="text-rose-400" size={26} />
        </div>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
          Xatolik yuz berdi
        </p>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
    );
  }

  /* ── EMPTY ── */
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
          <BookOpen className="text-blue-400" size={26} />
        </div>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
          Guruhlar topilmadi
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Sizga hali hech qanday guruh biriktirilmagan.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] tracking-widest font-semibold">
              <th className="px-5 py-4 text-left w-10">#</th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={12} /> Guruh nomi
                </span>
              </th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <Users size={12} /> O'quvchilar
                </span>
              </th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={12} /> Kunlar
                </span>
              </th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} /> Vaqt
                </span>
              </th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={12} /> O'qituvchi
                </span>
              </th>
              <th className="px-5 py-4 text-right">Amal</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {groups.map((group, index) => (
              <tr
                key={group.id}
                className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors duration-150"
              >
                <td className="px-5 py-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </span>
                </td>

                <td className="px-5 py-4 font-semibold text-gray-800 dark:text-gray-100">
                  {group.name}
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getCapacityStyle(group.currentStudents)}`}>
                    <Users size={11} /> {group.currentStudents} ta
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                    <CalendarDays size={11} /> {getDayLabel(group.lessonDays)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-medium font-mono">
                    <Clock size={13} className="text-gray-400" />
                    {group.lessonTime}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {avatarLetter(group)}
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {teacherName(group)}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => navigate(`/group-info/${group.id}`)}
                    className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors duration-150 shadow-sm shadow-blue-200 dark:shadow-none"
                  >
                    Batafsil <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden flex flex-col gap-3">
        {groups.map((group, index) => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm"
          >
            {/* Card header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-400 shrink-0">
                  {index + 1}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {group.name}
                </span>
              </div>
              <button
                onClick={() => navigate(`/group-info/${group.id}`)}
                className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors duration-150 shadow-sm shadow-blue-200 dark:shadow-none shrink-0"
              >
                Batafsil <ArrowRight size={13} />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-blue-50 dark:bg-blue-950/50 rounded-xl px-3 py-2">
                <p className="text-[10px] text-blue-400 font-medium flex items-center gap-1 mb-0.5">
                  <Users size={10} /> O'quvchilar
                </p>
                <p className={`text-xs font-bold ${getCapacityStyle(group.currentStudents).split(" ").filter(c => c.startsWith("text-")).join(" ")}`}>
                  {group.currentStudents} ta
                </p>
              </div>
              <div className="bg-violet-50 dark:bg-violet-950/50 rounded-xl px-3 py-2">
                <p className="text-[10px] text-violet-400 font-medium flex items-center gap-1 mb-0.5">
                  <CalendarDays size={10} /> Kunlar
                </p>
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  {getDayLabel(group.lessonDays)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2">
                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mb-0.5">
                  <Clock size={10} /> Vaqt
                </p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 font-mono">
                  {group.lessonTime}
                </p>
              </div>
            </div>

            {/* Teacher */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {avatarLetter(group)}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <GraduationCap size={11} className="inline mr-1" />
                {teacherName(group)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}