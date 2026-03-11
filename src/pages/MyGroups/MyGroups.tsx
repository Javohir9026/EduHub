import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { Users, Clock, Calendar } from "lucide-react";
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

const TeacherGroupsCards = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const TeacherId = localStorage.getItem("id");
      const api = import.meta.env.VITE_API_URL;

      const res = await apiClient.get(`${api}/groups/teacher/${TeacherId}`, {
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
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Guruhlar topilmadi</p>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 border hover:shadow-lg transition flex flex-col justify-between"
        >
          <h2 className="text-xl font-semibold mb-4">{group.name}</h2>

          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{group.currentStudents} ta student</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>Haftasiga {group.lessonDays} kun</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{group.lessonTime}</span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Ustoz: {group.teacher.firstName} {group.teacher.lastName}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate(`/group-info/${group.id}`)}
              className="bg-blue-500 hover:bg-blue-500/80 text-white px-3 py-1 rounded-lg flex items-center gap-2"
            >
              <Info size={16} /> Batafsil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherGroupsCards;