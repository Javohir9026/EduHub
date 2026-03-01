import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { useParams } from "react-router-dom";
import { Phone, Mail, User, Book, DollarSign } from "lucide-react";

type TeacherDetail = {
  id: number;
  login: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  salary: number;
  role: string;
  learningCenterId: number;
  created_at: string;
  updated_at: string;
};

const TeacherInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeacher(res.data.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTeacher();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse text-lg font-semibold">
        Yuklanmoqda...
      </div>
    );

  if (!teacher)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold">
        O‘qituvchi topilmadi
      </div>
    );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("uz-UZ");

  return (
    <div className="min-h-screen p-6 space-y-8">

      {/* HEADER WITH AVATAR */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 rounded-full bg-blue-400 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
          {teacher.name[0].toUpperCase()}
          {teacher.lastName[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold">
            {teacher.name} {teacher.lastName}
          </h1>
          <p className="mt-2 text-blue-100 font-medium text-lg">
            Fan: {teacher.subject}
          </p>
          <div className="mt-4 flex gap-4 flex-wrap">
            <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
              {teacher.role}
            </span>
          </div>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={<User />} title="Login">
          {teacher.login}
        </InfoCard>

        <InfoCard icon={<Phone />} title="Telefon">
          {teacher.phone}
        </InfoCard>

        <InfoCard icon={<Mail />} title="Email">
          {teacher.email}
        </InfoCard>

        <InfoCard icon={<Book />} title="Fan">
          {teacher.subject}
        </InfoCard>

        <InfoCard icon={<DollarSign />} title="Maosh">
          {teacher.salary.toLocaleString()} so‘m
        </InfoCard>

        <InfoCard icon={<User />} title="Rol">
          {teacher.role}
        </InfoCard>
      </div>

      {/* DATES */}
      <div className="grid md:grid-cols-2 gap-6">
        <InfoCard icon={<CalendarIcon />} title="Yaratilgan vaqti">
          {formatDate(teacher.created_at)}
        </InfoCard>
        <InfoCard icon={<CalendarIcon />} title="Yangilangan vaqti">
          {formatDate(teacher.updated_at)}
        </InfoCard>
      </div>
    </div>
  );
};

/* REUSABLE INFO CARD */
const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition transform hover:-translate-y-1 dark:!bg-fullbg">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-bold text-lg">{children}</p>
    </div>
  </div>
);

/* CALENDAR ICON */
const CalendarIcon = () => (
  <svg
    className="w-6 h-6 text-gray-500"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default TeacherInfoPage;