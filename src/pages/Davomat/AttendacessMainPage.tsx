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
          })),
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
      prev.map((s) => (s.id === studentId ? { ...s, status } : s)),
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
        { headers: { Authorization: `Bearer ${token}` } },
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
        { headers: { Authorization: `Bearer ${token}` } },
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
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Yuklanmoqda...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              Davomat
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              {students.length} ta o'quvchi
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-center min-w-[64px]">
            <p className="text-2xl font-medium text-gray-900 dark:text-white leading-none">
              {attendanceRate}%
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              davomat
            </p>
          </div>
        </div>

        {/* Lesson */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 mb-3">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3">
            Dars ma'lumotlari
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <input
              className="col-span-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 rounded-lg px-3 py-2 text-sm outline-none"
              type="text"
              placeholder="Dars nomi *"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
            />

            <input
              className="col-span-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 rounded-lg px-3 py-2 text-sm outline-none"
              type="text"
              placeholder="Izoh"
              value={lessonDesc}
              onChange={(e) => setLessonDesc(e.target.value)}
            />

            <input
              className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm"
              type="time"
              value={startTime.slice(0, 5)}
              onChange={(e) => setStartTime(e.target.value + ":00")}
            />

            <input
              className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm"
              type="time"
              value={endTime.slice(0, 5)}
              onChange={(e) => setEndTime(e.target.value + ":00")}
            />
          </div>
        </div>

        {/* Students */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden mb-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center">
                  {student.initials}
                </div>
                <span className="text-sm text-gray-800 dark:text-white">
                  {student.name}
                </span>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => toggleStatus(student.id, "present")}
                  className={`px-3 py-1.5 text-xs rounded-lg ${
                    student.status === "present"
                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "text-gray-400 border dark:border-zinc-700"
                  }`}
                >
                  Keldi
                </button>

                <button
                  onClick={() => toggleStatus(student.id, "absent")}
                  className={`px-3 py-1.5 text-xs rounded-lg ${
                    student.status === "absent"
                      ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "text-gray-400 border dark:border-zinc-700"
                  }`}
                >
                  Kelmadi
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default AttendancesMainPage;
