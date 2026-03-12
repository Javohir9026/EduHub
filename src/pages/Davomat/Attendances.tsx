import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Guruh</th>
              <th className="p-3">Student</th>
              <th className="p-3">Haftada</th>
              <th className="p-3">Vaqt</th>
              <th className="p-3">Ustoz</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        Guruhlar topilmadi
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700 text-left">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Guruh nomi</th>
            <th className="p-3">Studentlar</th>
            <th className="p-3">Haftada</th>
            <th className="p-3">Dars vaqti</th>
            <th className="p-3">Ustoz</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group, index) => (
            <tr
              key={group.id}
              className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="p-3">{index + 1}</td>

              <td className="p-3 font-medium">{group.name}</td>

              <td className="p-3">{group.currentStudents} ta</td>

              <td className="p-3">{group.lessonDays} kun</td>

              <td className="p-3">{group.lessonTime}</td>

              <td className="p-3">
                {group.teacher.firstName} {group.teacher.lastName}
              </td>

              <td className="p-3 text-right">
                <button
                  onClick={() => navigate(`/group-info/AttendancessMainPage`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 ml-auto"
                >
                  <Info size={16} /> Davomat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherGroupsTable;
