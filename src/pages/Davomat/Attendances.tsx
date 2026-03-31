import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import {
  Info,
  Users,
  Clock,
  Calendar,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
};

type Group = {
  id: number;
  name: string;
  lessonDays: number;
  lessonTime: string;
  currentStudents: number;
  teacher: Teacher;
};

const TeacherGroupsTable = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();
  const updatedGroupId = location.state?.updatedGroupId;

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const api = import.meta.env.VITE_API_URL;

      const res = await apiClient.get(`${api}/groups/teacher/my-groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(res.data.data || []);
    } catch (error: any) {
      console.log("Guruhlarni olishda xatolik:", error.response || error);
      toast.error("Guruhlarni olishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  /* ── LOADING ── */
  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 uppercase text-[11px] tracking-widest font-semibold">
                {[
                  "#",
                  "Guruh nomi",
                  "Talabalar",
                  "Haftada",
                  "Dars vaqti",
                  "Ustoz",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-5 py-4 text-left last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[
                    "24px",
                    "120px",
                    "60px",
                    "56px",
                    "72px",
                    "110px",
                    "88px",
                  ].map((w, j) => (
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
                  <div
                    key={j}
                    className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
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

  const avatarLetter = (g: Group) =>
    g.teacher?.firstName?.[0] ?? g.teacher?.lastName?.[0] ?? "?";

  const teacherName = (g: Group) =>
    `${g.teacher?.firstName ?? ""} ${g.teacher?.lastName ?? ""}`.trim() || "—";

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
                  <Users size={12} /> Talabalar
                </span>
              </th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> Haftada
                </span>
              </th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} /> Dars vaqti
                </span>
              </th>
              <th className="px-5 py-4 text-left">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={12} /> Ustoz
                </span>
              </th>
              <th className="px-5 py-4 text-right">Action</th>
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <Users size={11} /> {group.currentStudents} ta
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                    <Calendar size={11} /> {group.lessonDays} kun
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-medium">
                    <Clock size={13} className="text-gray-400" />{" "}
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
                    onClick={() =>
                      navigate(`/group-info/AttendancessMainPage/${group.id}`)
                    }
                    className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors duration-150 shadow-sm shadow-blue-200 dark:shadow-none"
                  >
                    <Info size={13} /> Davomat
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
                onClick={() =>
                  navigate(`/group-info/AttendancessMainPage/${group.id}`)
                }
                className={`inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors duration-150 shadow-sm
    ${
      updatedGroupId === group.id
        ? "bg-green-500 hover:bg-green-600"
        : "bg-blue-500 hover:bg-blue-600"
    }
  `}
              >
                <Info size={13} />
                {updatedGroupId === group.id ? "olingan" : "Davomat"}
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-blue-50 dark:bg-blue-950/50 rounded-xl px-3 py-2">
                <p className="text-[10px] text-blue-400 font-medium flex items-center gap-1 mb-0.5">
                  <Users size={10} /> Talabalar
                </p>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {group.currentStudents} ta
                </p>
              </div>
              <div className="bg-violet-50 dark:bg-violet-950/50 rounded-xl px-3 py-2">
                <p className="text-[10px] text-violet-400 font-medium flex items-center gap-1 mb-0.5">
                  <Calendar size={10} /> Haftada
                </p>
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  {group.lessonDays} kun
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2">
                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mb-0.5">
                  <Clock size={10} /> Vaqt
                </p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
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
};

export default TeacherGroupsTable;