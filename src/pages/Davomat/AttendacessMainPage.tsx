import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent";

interface Student {
  id: number;
  name: string;
  initials: string;
  status: AttendanceStatus;
}

interface GroupStudent {
  id: number;
  joinedAt: string;
  leftAt: string | null;
  student: {
    id: number;
    fullName: string;
  };
}

interface Group {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  lessonDays: string;
  lessonTime: string;
  room: string;
  maxStudents: number;
  currentStudents: number;
  monthlyPrice: string;
  isActive: boolean;
  groupStudents: GroupStudent[];
}

const AttendancesMainPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [lessonName, setLessonName] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [startTime, setStartTime] = useState("14:00:00");
  const [endTime, setEndTime] = useState("16:00:00");

  useEffect(() => {
    if (!id) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}/groups/teacher/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const group: Group = res.data.data;

        setStudents(
          group.groupStudents.map((gs) => ({
            id: gs.student.id,
            name: gs.student.fullName,
            initials: gs.student.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
            status: "present",
          }))
        );
      } catch (error) {
        console.error("O'quvchilarni olishda xatolik:", error);
        toast.error("O'quvchilarni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  const toggleStatus = (studentId: number, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const saveAttendance = async () => {
    if (!lessonName.trim()) {
      toast.error("Dars nomini kiriting");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("access_token");
      const api = import.meta.env.VITE_API_URL;
      const teacherId = localStorage.getItem("id");
      const today = new Date().toISOString().split("T")[0];

      const lessonRes = await apiClient.post(
        `${api}/lessons`,
        {
          name: lessonName,
          description: lessonDesc,
          groupId: Number(id),
          teacherId,
          lessonDate: today,
          startTime,
          endTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const lessonId = lessonRes.data.id;
      await apiClient.post(
        `${api}/attendances`,
        {
          groupId: Number(id),
          teacherId,
          lessonId,
          date: today,
          students: students.map((s) => ({
            studentId: s.id,
            status: s.status === "present" ? "PRESENT" : "ABSENT",
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Davomat saqlandi");
      navigate("/attendances", { state: { updatedGroupId: Number(id) } });
    } catch (error: any) {
      console.error(error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.length - presentCount;
  const attendanceRate =
    students.length > 0
      ? Math.round((presentCount / students.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-200 dark:border-zinc-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
          <p className="text-xs tracking-widest uppercase text-gray-400 dark:text-zinc-600">
            Yuklanmoqda
          </p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("uz-UZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 dark:text-zinc-600 mb-1">
              {today}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">
              Davomat
            </h1>
          </div>

          {/* Stat chips */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                {presentCount} keldi
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                {absentCount} kelmadi
              </span>
            </div>

            {/* Rate ring */}
            <div className="ml-1 relative w-12 h-12 flex-shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-gray-100 dark:text-zinc-800"
                />
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - attendanceRate / 100)}`}
                  className="text-gray-900 dark:text-white transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-900 dark:text-white">
                {attendanceRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* ── Students list ── */}
          <div className="rounded-2xl border border-gray-100 dark:border-zinc-800/60 overflow-hidden bg-white dark:bg-zinc-950">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800/60 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-zinc-500">
                O'quvchilar
              </span>
              <span className="text-xs text-gray-400 dark:text-zinc-600">
                {students.length} ta
              </span>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-zinc-800/60">
              {students.map((student, idx) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between px-5 py-3.5 group transition-colors hover:bg-gray-50/70 dark:hover:bg-zinc-900/50"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold tracking-wide flex-shrink-0"
                      style={{
                        background:
                          student.status === "present"
                            ? "rgb(240 253 244)"
                            : "rgb(254 242 242)",
                        color:
                          student.status === "present"
                            ? "rgb(22 163 74)"
                            : "rgb(220 38 38)",
                      }}
                    >
                      {student.initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-800 dark:text-zinc-100 truncate">
                        {student.name}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-zinc-600">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleStatus(student.id, "present")}
                      className={`px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                        student.status === "present"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20"
                          : "text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      Keldi
                    </button>
                    <button
                      onClick={() => toggleStatus(student.id, "absent")}
                      className={`px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                        student.status === "absent"
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/20"
                          : "text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      Kelmadi
                    </button>
                  </div>
                </div>
              ))}

              {students.length === 0 && (
                <div className="py-16 text-center text-sm text-gray-300 dark:text-zinc-700">
                  O'quvchilar topilmadi
                </div>
              )}
            </div>
          </div>

          {/* ── Lesson form ── */}
          <div className="rounded-2xl border border-gray-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800/60">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-zinc-500">
                Dars ma'lumotlari
              </span>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {/* Lesson name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 tracking-wide">
                  Dars nomi <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Algebra №12"
                  value={lessonName}
                  onChange={(e) => setLessonName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-100 placeholder:text-gray-300 dark:placeholder:text-zinc-700 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 tracking-wide">
                  Izoh
                </label>
                <input
                  type="text"
                  placeholder="Ixtiyoriy"
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-100 placeholder:text-gray-300 dark:placeholder:text-zinc-700 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors"
                />
              </div>

              {/* Time row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 tracking-wide">
                    Boshlanish
                  </label>
                  <input
                    type="time"
                    value={startTime.slice(0, 5)}
                    onChange={(e) => setStartTime(e.target.value + ":00")}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-100 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 tracking-wide">
                    Tugash
                  </label>
                  <input
                    type="time"
                    value={endTime.slice(0, 5)}
                    onChange={(e) => setEndTime(e.target.value + ":00")}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-100 outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-zinc-800/60 my-1" />

              {/* Summary */}
              <div className="rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 px-4 py-3 flex justify-between text-xs">
                <span className="text-gray-400 dark:text-zinc-500">Jami o'quvchi</span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">{students.length}</span>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 px-4 py-3 flex justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-500">Keldi</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{presentCount}</span>
              </div>
              <div className="rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 px-4 py-3 flex justify-between text-xs">
                <span className="text-red-500 dark:text-red-400">Kelmadi</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{absentCount}</span>
              </div>

              {/* Save button */}
              <button
                onClick={saveAttendance}
                disabled={saving}
                className="mt-1 w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all
                  bg-gray-950 dark:bg-white text-white dark:text-black
                  hover:bg-gray-800 dark:hover:bg-gray-100
                  disabled:opacity-40 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  "Saqlash"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancesMainPage;