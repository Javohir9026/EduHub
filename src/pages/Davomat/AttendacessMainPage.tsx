import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import {useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent";

interface Student {
  id: number;
  name: string;
  avatar: string;
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

const statusConfig = {
  present: {
    label: "Keldi",
    color: "text-green-600",
    bg: "bg-green-100",
    active: "bg-green-500 text-white",
  },
  absent: {
    label: "Kelmadi",
    color: "text-red-600",
    bg: "bg-red-100",
    active: "bg-red-500 text-white",
  },
};

const AttendancesMainPage = () => {
  const { id } = useParams();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}/groups/teacher/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const group: Group = res.data.data;

        const students: Student[] = group.groupStudents.map((gs) => ({
          id: gs.student.id,
          name: gs.student.fullName,
          avatar: gs.student.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          status: "present",
        }));

        setStudents(students);
      } catch (error) {
        console.error("Studentlarni olishda xatolik", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudents();
  }, [id]);

  const setStatus = (studentId: number, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s)),
    );
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);

      const today = new Date().toISOString().split("T")[0];

      const requests = students.map((s) => {
        const teacherId = Number(localStorage.getItem("teacher_id"));
        const payload = {
          groupId: Number(id),
          studentId: s.id,
          teacherId: teacherId,
          date: today,
          status: s.status === "present" ? "PRESENT" : "ABSENT",
        };

        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        return apiClient.post(`${api}/attendances`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      });

      await Promise.all(requests);

      toast.success('guruhdan davomat olindi');
      navigate(`/AttendancessUpdatePage/${id}`);
    } catch (error: any) {
      console.log("ERROR RESPONSE:", error.response?.data);
      console.log("ERROR STATUS:", error.response?.status);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.status === "present").length;

  const attendanceRate =
    students.length > 0
      ? Math.round((presentCount / students.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Studentlar yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">📋 Davomat</h1>
            <p className="text-sm text-gray-500">
              Jami o‘quvchilar: {students.length}
            </p>
          </div>

          <div className="bg-indigo-500 text-white px-6 py-3 rounded-xl">
            <div className="text-xl font-bold">{attendanceRate}%</div>
            <div className="text-xs">Davomat</div>
          </div>
        </div>

        {/* Student list */}
        <div className="bg-white rounded-xl shadow border">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between px-6 py-4 border-b last:border-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold">
                  {student.avatar}
                </div>

                <div>
                  <p className="font-medium">{student.name}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {(Object.keys(statusConfig) as AttendanceStatus[]).map(
                  (status) => {
                    const cfg = statusConfig[status];
                    const active = student.status === status;

                    return (
                      <button
                        key={status}
                        onClick={() => setStatus(student.id, status)}
                        className={`px-3 py-1 text-xs rounded font-semibold
                        ${active ? cfg.active : `${cfg.bg} ${cfg.color}`}`}
                      >
                        {cfg.label}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {saving ? "Saqlanmoqda..." : "💾 Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancesMainPage;
