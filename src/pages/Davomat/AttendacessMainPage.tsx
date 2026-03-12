// AttendancesMainPage.tsx
import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Student {
  id: number;
  name: string;
  avatar: string;
  status: AttendanceStatus;
}

interface GroupStudent {
  student: {
    id: number;
    fullName: string;
  };
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  present: { label: "Keldi", color: "green-500", bg: "green-100", dot: "green-600" },
  absent: { label: "Kelmadi", color: "red-500", bg: "red-100", dot: "red-600" },
  late: { label: "Kech keldi", color: "yellow-500", bg: "yellow-100", dot: "yellow-600" },
  excused: { label: "Uzrli", color: "indigo-500", bg: "indigo-100", dot: "indigo-600" },
};

const AttendancesMainPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<AttendanceStatus | "all">("all");
  const [selectedDate] = useState(new Date());
  const groupId = localStorage.getItem("id");

  if (!groupId)
    return <div className="text-center mt-20 text-red-500">Group ID topilmadi</div>;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}/groups/teacher/my-groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const groups = res.data.data;
        // Guruhni topamiz
        const group = groups.find((g: any) => g.id === parseInt(groupId));

        if (!group) return;

        // groupStudents ichidagi studentlarni o'zlashtiramiz
        const students: Student[] = group.groupStudents.map((gs: GroupStudent) => ({
          id: gs.student.id,
          name: gs.student.fullName,
          avatar: gs.student.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          status: "present", // default holat
        }));

        // State ga set qilamiz
        setStudents(students);
      } catch (err) {
        console.error("Studentlarni olishda xatolik", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [groupId]);

  const setStatus = (id: number, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const saveAttendance = async () => {
    try {
      await apiClient.post(`/groups/${groupId}/attendance`, { students });
      alert("✅ Davomat saqlandi");
    } catch (err) {
      console.error("Davomatni saqlashda xatolik", err);
    }
  };

  const filtered = filter === "all" ? students : students.filter((s) => s.status === filter);

  const counts = {
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
    excused: students.filter((s) => s.status === "excused").length,
  };

  const attendanceRate =
    students.length > 0
      ? Math.round(((counts.present + counts.late) / students.length) * 100)
      : 0;

  const dateStr = selectedDate.toLocaleDateString("uz-UZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500">
        📡 Studentlar yuklanmoqda...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📋 Davomat</h1>
            <p className="text-gray-500 mt-1 capitalize text-sm">{dateStr}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl px-6 py-3 text-center shadow-lg">
            <div className="text-2xl font-extrabold">{attendanceRate}%</div>
            <div className="text-xs opacity-80 mt-1">Davomat darajasi</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {(Object.keys(statusConfig) as AttendanceStatus[]).map((key) => {
            const cfg = statusConfig[key];
            return (
              <div
                key={key}
                onClick={() => setFilter(filter === key ? "all" : key)}
                className={`cursor-pointer p-4 rounded-xl border-2 shadow-sm transition-transform transform hover:-translate-y-1
                  ${filter === key ? `border-${cfg.color} bg-${cfg.bg}` : "border-gray-200 bg-white"}`}
              >
                <div className={`text-xl font-bold text-${cfg.color}`}>{counts[key]}</div>
                <div className="text-xs text-gray-500 mt-1">{cfg.label}</div>
                <div
                  className={`h-1 rounded-full mt-2 w-full bg-${cfg.color}`}
                  style={{ width: `${(counts[key] / students.length) * 100}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-800 text-sm">
              {filter === "all"
                ? `Barcha o'quvchilar (${students.length})`
                : `${statusConfig[filter].label} (${filtered.length})`}
            </span>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="text-gray-500 text-xs border px-2 py-1 rounded hover:bg-gray-100"
              >
                ✕ Filterni tozalash
              </button>
            )}
          </div>

          {filtered.map((student) => {
            const cfg = statusConfig[student.status];
            return (
              <div
                key={student.id}
                className="flex items-center px-6 py-3 gap-4 hover:bg-gray-50 transition"
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-gray-200`}>
                  {student.avatar}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full bg-${cfg.dot}`}></span>
                    <span className={`text-${cfg.color} text-xs font-medium`}>{cfg.label}</span>
                  </div>
                </div>

                {/* Status buttons */}
                <div className="flex gap-2 flex-wrap justify-end">
                  {(Object.keys(statusConfig) as AttendanceStatus[]).map((s) => {
                    const sc = statusConfig[s];
                    const active = student.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatus(student.id, s)}
                        className={`text-xs font-semibold px-2 py-1 rounded transition-all
                          ${active ? `bg-${sc.color} text-white shadow-md` : `bg-${sc.bg} text-${sc.color}`}`}
                      >
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveAttendance}
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform"
          >
            💾 Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancesMainPage;