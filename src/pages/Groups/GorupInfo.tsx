import apiClient from "@/api/ApiClient";
import type { GroupDetail } from "@/lib/types";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  Home,
  User,
  ChevronRight,
} from "lucide-react";
import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

const DAY_MAP: Record<string, string> = {
  DUSHANBA: "1", SESHANBA: "2", CHORSHANBA: "3",
  PAYSHANBA: "4", JUMA: "5", SHANBA: "6", YAKSHANBA: "7",
};
const formatLessonDays = (days: string): string => {
  if (!days) return "-";
  return days
    .split(",")
    .map((d) => DAY_MAP[d.trim()] ?? d.trim())
    .sort((a, b) => Number(a) - Number(b))
    .join("-");
};

export const GroupInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const endpoint =
          role === "center"
            ? `/groups/${id}`
            : role === "teacher"
              ? `/groups/teacher/${id}`
              : "";
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`${api}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGroup();
  }, [id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("uz-UZ");

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-8 animate-pulse">
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl w-full md:w-3/4 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded-xl w-full"></div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-300 rounded-xl dark:bg-gray-700 w-full"></div>
          <div className="h-40 bg-gray-300 rounded-xl dark:bg-gray-700 w-full"></div>
        </div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl w-full"></div>
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
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Guruhlar", href: "/groups" },
            { title: group.name, href: `/group-info/${group.id}` },
          ]}
        />
      </div>

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
              {group.currentStudents}/{group.maxStudents} o'quvchi
            </span>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard icon={<Calendar />} title="Boshlanish">
            {formatDate(group.startDate)}
          </InfoCard>

          <InfoCard icon={<Calendar />} title="Tugash">
            {formatDate(group.endDate)}
          </InfoCard>

          <InfoCard icon={<Clock />} title="Dars vaqti">
            {group.lessonTime} | {formatLessonDays(String(group.lessonDays))} kun/hafta
          </InfoCard>

          <InfoCard icon={<DollarSign />} title="Oylik to'lov">
            {Number(group.monthlyPrice).toLocaleString("uz-UZ")} so'm
          </InfoCard>

          <InfoCard icon={<Home />} title="Xona">
            {group.room}
          </InfoCard>

          <InfoCard icon={<User />} title="O'qituvchi">
            {group.teacher ? (
              `${group.teacher.name} ${group.teacher.lastName}`
            ) : (
              <span className="text-sm text-gray-500">
                O'qituvchi Biriktirilmagan
              </span>
            )}
          </InfoCard>
        </div>

        {/* TEACHER & CENTER */}
        <div className="grid md:grid-cols-2 gap-6">
          {group.teacher ? (
            <div>
              {role === "center" ? (
                <div
                  className="bg-white shadow-lg rounded-xl p-6 dark:!bg-fullbg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-xl transition"
                  onClick={() => navigate(`/teacher-info/${group.teacher.id}`)}
                >
                  <h2 className="text-xl font-bold mb-4">O'qituvchi</h2>
                  <p className="font-semibold">
                    {group.teacher.name} {group.teacher.lastName}
                  </p>
                  <p className="text-gray-500">{group.teacher.phone}</p>
                  <p className="text-gray-500">{group.teacher.email}</p>
                </div>
              ) : (
                <div className="bg-white shadow-lg rounded-xl p-6 dark:!bg-fullbg hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                  <h2 className="text-xl font-bold mb-4">O'qituvchi</h2>
                  <p className="font-semibold">
                    {group.teacher.name} {group.teacher.lastName}
                  </p>
                  <p className="text-gray-500">{group.teacher.phone}</p>
                  <p className="text-gray-500">{group.teacher.email}</p>
                </div>
              )}
            </div>
          ) : (
            ""
          )}

          <div className="bg-white shadow-lg rounded-xl p-6 dark:!bg-fullbg hover:bg-blue-50 dark:hover:bg-gray-700 transition">
            <h2 className="text-xl font-bold mb-4">O'quv markaz</h2>
            <p className="font-semibold">{group.learningCenter.name}</p>
            <p className="text-gray-500">{group.learningCenter.address}</p>
            <p className="text-gray-500">{group.learningCenter.phone}</p>
          </div>
        </div>

        {/* STUDENTS */}
        <div className="bg-white shadow-xl rounded-xl p-6 dark:!bg-background">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users /> O'quvchilar
          </h2>

          {group.groupStudents.length === 0 ? (
            <p className="text-gray-500">Hozircha o'quvchilar yo'q</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {group.groupStudents.map((gs) =>
                role === "center" ? (
                  <Link
                    key={gs.id}
                    to={`/student-info/${gs.student.id}`}
                    className="p-4 border rounded-2xl hover:shadow-lg transition bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold">{gs.student.fullName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {gs.student.phone}
                      </p>
                    </div>
                    <span className="text-gray-400 transition">
                      <ChevronRight />
                    </span>
                  </Link>
                ) : (
                  <div
                    key={gs.id}
                    className="p-4 border rounded-2xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold">{gs.student.fullName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {gs.student.phone}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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