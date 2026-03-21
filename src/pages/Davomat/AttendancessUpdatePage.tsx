import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import apiClient from "@/api/ApiClient";

type AttendanceStatus = "PRESENT" | "ABSENT";

interface Student {
  id: number;
  fullName: string;
}

interface Attendance {
  id: number;
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
        const groupId = localStorage.getItem('id');

        // ✅ TO‘G‘RI ENDPOINT (attendance olish)
        const res = await apiClient.get(
          `${api}/attendances/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("FULL RESPONSE:", res.data);

        const attendanceList = res.data?.data || [];

        console.log("ATTENDANCE:", attendanceList);

        // ✅ student list
        const studentList: Student[] = attendanceList.map((a: any) => ({
          id: a.student.id,
          fullName: a.student.fullName,
        }));

        setStudents(studentList);

        // ✅ attendance list
        const attendanceData: Attendance[] = attendanceList.map((a: any) => ({
          id: a.id,
          studentId: a.student.id,
          status: a.status,
        }));

        setAttendance(attendanceData);
      } catch (err: any) {
        console.log("ERROR:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    if (id && date) {
      fetchAll();
    }
  }, [id, date]);

  const handleChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const api = import.meta.env.VITE_API_URL;

      await Promise.all(
        attendance.map((item) =>
          apiClient.patch(
            `${api}/attendances/${item.id}`,
            { status: item.status },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      alert("✅ Saqlandi!");
    } catch (err: any) {
      console.log("SAVE ERROR:", err.response || err);
      alert("❌ Xatolik");
    }
  };

  if (loading) return <div>⏳ Yuklanmoqda...</div>;

  if (!students.length)
    return <div>❗ Bu sanada hali davomat olinmagan</div>;

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