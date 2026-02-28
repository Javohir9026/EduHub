import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { useParams } from "react-router-dom";
import { Cake, GroupIcon, Home, PhoneCall, Voicemail } from "lucide-react";

type Student = {
  id: number;
  fullName: string;
  phone: string;
  parentPhone: string;
  birthDate: string;
  address: string;
  isActive: boolean;
  groupStudents?: { id: number; name: string }[];
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

  if (loading)
    return (
      <div className="min-h-screen p-6 flex flex-col md:flex-row gap-8 justify-center items-start animate-pulse">
        <div className="flex flex-col items-center gap-6 md:w-1/4">
          <div className="w-36 h-36 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl shadow bg-transparent flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if (!student)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-bold text-xl">
        Student topilmadi
      </div>
    );

  return (
    <div className="min-h-screen p-6 flex flex-col md:flex-row gap-8 justify-center items-start">
      {/* Profil bo‘limi */}
      <div className="flex flex-col items-center gap-6 md:w-1/4">
        <div className="w-36 h-36 rounded-full bg-blue-400 flex items-center justify-center text-white text-5xl font-bold shadow-lg hover:scale-105 transition-transform">
          {student.fullName[0].toUpperCase()}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">
          {student.fullName}
        </h1>
        <span
          className={`px-6 py-2 rounded-full text-sm font-semibold ${
            student.isActive
              ? "bg-green-200 text-green-900"
              : "bg-red-200 text-red-900"
          }`}
        >
          {student.isActive ? "Faol" : "Faol emas"}
        </span>
      </div>

      {/* Ma’lumotlar bo‘limi */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex items-center gap-3 bg-transparent">
          <PhoneCall className="text-2xl text-blue-500" />
          <div>
            <p className="text-gray-500 font-medium text-sm">Telefon</p>
            <p className="font-bold text-lg text-gray-800">{student.phone}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex items-center gap-3 bg-transparent">
          <Voicemail className="text-2xl text-blue-500" />
          <div>
            <p className="text-gray-500 font-medium text-sm">
              Ota/onasi telefoni
            </p>
            <p className="font-bold text-lg text-gray-800">
              {student.parentPhone}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex items-center gap-3 bg-transparent">
          <Cake className="text-2xl text-blue-500" />
          <div>
            <p className="text-gray-500 font-medium text-sm">Tugilgan sana</p>
            <p className="font-bold text-lg text-gray-800 ">
              {student.birthDate}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex items-center gap-3 sm:col-span-2 bg-transparent">
          <Home className="text-2xl text-blue-500" />
          <div>
            <p className="text-gray-500 font-medium text-sm">Manzil</p>
            <p className="font-bold text-lg text-gray-800">{student.address}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col sm:col-span-2 gap-2 bg-transparent">
          <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <GroupIcon className="text-blue-500 text-2xl" /> Guruhlar
          </p>
          <p className="font-bold text-lg text-gray-800">
            {student.groupStudents && student.groupStudents.length > 0
              ? student.groupStudents.map((g) => g.name).join(", ")
              : "Hech qanday guruh yo‘q"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoPage;
