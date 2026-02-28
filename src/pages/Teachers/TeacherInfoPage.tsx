import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { useParams } from "react-router-dom";
import type { Teacher } from "@/lib/types";

const TeacherInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeacher(res.data.data);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    if (id) fetchTeacher();
  }, [id]);

  return <div>
    {teacher?.name + " " + teacher?.lastName}
  </div>;
};

export default TeacherInfoPage;
