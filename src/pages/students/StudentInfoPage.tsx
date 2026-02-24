import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { useParams } from "react-router-dom";

type Student = {
  id: number;
  fullName: string;
  phone: string;
  parentPhone: string;
  birthDate: string;
  address: string;
  isActive: boolean;
  groupStudents?: any[];
};

const StudentInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(res.data.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (!student) return <div>Student topilmadi</div>;

  return <div className="p-4 bg-white">{student.fullName}</div>;
};

export default StudentInfoPage;
