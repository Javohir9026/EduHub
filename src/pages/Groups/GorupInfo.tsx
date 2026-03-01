import apiClient from "@/api/ApiClient";
import type { GroupDetail } from "@/lib/types";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, Calendar, Clock, DollarSign, Home, User, ChevronRight } from "lucide-react";

export const GroupInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<GroupDetail | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}/groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGroup();
  }, [id]);

  // Sana format
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("uz-UZ");

  // ----- SKELETON LOADING -----
  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl w-full md:w-3/4 mx-auto"></div>

        {/* Info Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300  dark:bg-gray-700 rounded-xl w-full"></div>
          ))}
        </div>

        {/* Teacher & Center skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-300 rounded-xl  dark:bg-gray-700 w-full"></div>
          <div className="h-40 bg-gray-300 rounded-xl  dark:bg-gray-700 w-full"></div>
        </div>

        {/* Students skeleton */}
        <div className="h-64 bg-gray-300  dark:bg-gray-700 rounded-xl w-full"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold">
        Guruh topilmadi
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-extrabold">{group.name}</h1>
        <p className="mt-2 text-blue-100">{group.description}</p>
        <div className="mt-4 flex gap-4 flex-wrap">
          <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
            {group.isActive ? "Faol" : "Faol emas"}
          </span>
          <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
            {group.currentStudents}/{group.maxStudents} o‘quvchi
          </span>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <InfoCard icon={<Calendar />} title="Boshlanish">
          {formatDate(group.startDate)}
        </InfoCard>

        <InfoCard icon={<Calendar />} title="Tugash">
          {formatDate(group.endDate)}
        </InfoCard>

        <InfoCard icon={<Clock />} title="Dars vaqti">
          {group.lessonTime} | {group.lessonDays} kun/hafta
        </InfoCard>

        <InfoCard icon={<DollarSign />} title="Oylik to‘lov">
          {group.monthlyPrice.toLocaleString()} so‘m
        </InfoCard>

        <InfoCard icon={<Home />} title="Xona">
          {group.room}
        </InfoCard>

        <InfoCard icon={<User />} title="O‘qituvchi">
          {group.teacher.name} {group.teacher.lastName}
        </InfoCard>
      </div>

      {/* TEACHER & CENTER */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link to={`/teacher-info/${group.teacher.id}`} className="bg-white shadow-lg rounded-xl p-6 dark:!bg-fullbg">
          <h2 className="text-xl font-bold mb-4">O‘qituvchi</h2>
          <p className="font-semibold">
            {group.teacher.name} {group.teacher.lastName}
          </p>
          <p className="text-gray-500">{group.teacher.phone}</p>
          <p className="text-gray-500">{group.teacher.email}</p>
        </Link>

        <div className="bg-white shadow-lg rounded-xl p-6 dark:!bg-fullbg">
          <h2 className="text-xl font-bold mb-4">O‘quv markaz</h2>
          <p className="font-semibold">{group.learningCenter.name}</p>
          <p className="text-gray-500">{group.learningCenter.address}</p>
          <p className="text-gray-500">{group.learningCenter.phone}</p>
        </div>
      </div>

      {/* STUDENTS */}
      <div className="bg-white shadow-xl rounded-xl p-6 dark:!bg-background">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Users /> O‘quvchilar
        </h2>

        {group.groupStudents.length === 0 ? (
          <p className="text-gray-500">Hozircha o‘quvchilar yo‘q</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {group.groupStudents.map((gs) => (
              <Link
                key={gs.id}
                to={`/student-info/${gs.student.id}`}
                className="p-4 border rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-blue-50 flex justify-between group items-center dark:!bg-fullbg"
              >
                <div className="flex flex-col">
                  <p className="font-semibold">{gs.student.fullName}</p>
                  <p className="text-sm text-gray-500">{gs.student.phone}</p>
                </div>
                <span className="hidden group-hover:block">
                  <ChevronRight />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* REUSABLE CARD */
const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition dark:!bg-fullbg">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-bold text-lg">{children}</p>
    </div>
  </div>
);