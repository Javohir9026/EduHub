import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import apiClient from "@/api/ApiClient";

type AttendanceStatus = "PRESENT" | "ABSENT";

interface Student {
  id: number;
  fullName: string;
}

interface Attendance {
  id?: number;
  studentId: number;
  status: AttendanceStatus;
}

const AttendancessUpdatePage = () => {
  const { id } = useParams(); // groupId
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        // 🔥 1. STUDENTLAR
        const studentRes = await apiClient.get(`${api}/groups/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const studentList = Array.isArray(studentRes.data)
          ? studentRes.data
          : [];

        setStudents(studentList);
        console.log("URL:", `${api}/attendances`);
        console.log("PARAMS:", { groupId: id, date });

        // 🔥 2. ATTENDANCE (agar mavjud bo‘lsa)
        let attendanceList: any[] = [];

        try {
          const attRes = await apiClient.get(`${api}/attendances`, {
            params: { groupId: id, date },
            headers: { Authorization: `Bearer ${token}` },
          });

          attendanceList = Array.isArray(attRes.data) ? attRes.data : [];
        } catch {
          attendanceList = [];
        }

        // 🔥 3. MERGE
        const merged = studentList.map((student: Student) => {
          const found = attendanceList.find(
            (a) => a.student?.id === student.id,
          );

          return {
            studentId: student.id,
            id: found?.id,
            status: found?.status || "ABSENT",
          };
        });

        setAttendance(merged);
      } catch (err: any) {
        console.log("ERROR:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, date]);

  // 🔥 STATUS CHANGE
  const handleChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status } : item,
      ),
    );
  };

  // 🔥 SAVE (PATCH yoki POST)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const api = import.meta.env.VITE_API_URL;

      await Promise.all(
        attendance.map((item) => {
          // update
          if (item.id) {
            return apiClient.patch(
              `${api}/attendances/${item.id}`,
              { status: item.status },
              { headers: { Authorization: `Bearer ${token}` } },
            );
          }

          // create
          return apiClient.post(
            `${api}/attendances`,
            {
              studentId: item.studentId,
              groupId: id,
              date,
              status: item.status,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }),
      );

      alert("✅ Saqlandi!");
    } catch (err: any) {
      console.log("SAVE ERROR:", err.response || err);
      alert("❌ Xatolik");
    }
  };

  if (loading) return <div>⏳ Yuklanmoqda...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📋 Davomat</h1>

      {students.map((student) => {
        const att = attendance.find((a) => a.studentId === student.id);

        return (
          <div
            key={student.id}
            className="flex justify-between border p-3 mb-2 rounded"
          >
            <span>{student.fullName}</span>

            <select
              value={att?.status || "ABSENT"}
              onChange={(e) =>
                handleChange(student.id, e.target.value as AttendanceStatus)
              }
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>
        );
      })}

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        💾 Saqlash
      </button>
    </div>
  );
};

export default AttendancessUpdatePage;
