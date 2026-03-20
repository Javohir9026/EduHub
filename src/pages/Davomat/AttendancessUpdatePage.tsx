import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import apiClient from "@/api/ApiClient";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Attendance {
  id: number;
  status: AttendanceStatus;
  date: string;
  group?: {
    id: number;
  };
  student: {
    fullName: string;
  };
}

const AttendancessUpdatePage = () => {
  const { id } = useParams(); // groupId
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");

  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 GET ATTENDANCES
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        console.log("ID:", id);
        console.log("DATE:", date);

        const res = await apiClient.get(`${api}/attendances`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("FULL DATA:", res.data.data);

        const list = res.data.data || [];

        // 🔥 FILTER
        const filtered = list.filter((item: Attendance) => {
          return (
            String(item.group?.id) === String(id) &&
            item.date?.slice(0, 10) === date
          );
        });

        console.log("FILTERED:", filtered);

        setData(filtered);
      } catch (err: any) {
        console.log("GET ERROR:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    if (id && date) {
      fetchAttendance();
    }
  }, [id, date]);

  // 🔥 STATUS CHANGE
  const handleStatusChange = (id: number, newStatus: AttendanceStatus) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  // 🔥 UPDATE (PATCH)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const api = import.meta.env.VITE_API_URL;

      await Promise.all(
        data.map((item) =>
          apiClient.patch(
            `${api}/api/v1/attendances/${item.id}`,
            {
              status: item.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ),
      );

      alert("✅ Saqlandi!");
    } catch (err: any) {
      console.log("PATCH ERROR:", err.response || err);
      alert("❌ Xatolik yuz berdi");
    }
  };

  // 🔥 LOADING
  if (loading) {
    return <div className="text-center mt-20">⏳ Yuklanmoqda...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📋 Davomatni yangilash</h1>

      {data.length === 0 ? (
        <p>❌ Hech qanday davomat topilmadi</p>
      ) : (
        <>
          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <span className="font-medium">{item.student?.fullName}</span>

                <select
                  value={item.status}
                  onChange={(e) =>
                    handleStatusChange(
                      item.id,
                      e.target.value as AttendanceStatus,
                    )
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            💾 Saqlash
          </button>
        </>
      )}
    </div>
  );
};

export default AttendancessUpdatePage;
