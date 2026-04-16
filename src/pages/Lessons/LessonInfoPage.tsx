import { useEffect, useState } from "react";
import { Calendar, Clock, User, Users, BookOpen } from "lucide-react";
import { useParams } from "react-router-dom";
import apiClient from "@/api/ApiClient";
import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

type Lesson = {
  id: number;
  name: string;
  description: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  group: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;
    lastName: string;
  };
};

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-100 dark:bg-white/5">
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-5 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LessonInfoPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonName, setLessonName] = useState("");
  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`${api}/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;

      // 🔥 mapping (attendance ishlatmaymiz)
      const mappedLesson: Lesson = {
        id: data.id,
        name: data.name,
        description: data.description,
        lessonDate: data.lessonDate,
        startTime: data.startTime,
        endTime: data.endTime,
        group: {
          id: data.group.id,
          name: data.group.name,
        },
        teacher: {
          id: data.teacher.id,
          name: data.teacher.name,
          lastName: data.teacher.lastName,
        },
      };
      setLessonName(data.name);
      setLesson(mappedLesson);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 dark:bg-background min-h-screen">
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Darslar", href: "/lessons" },
            { title: lessonName, href: `/lesson-info/${lesson?.id}` },
          ]}
        />
      </div>
      <div className="max-w-5xl mx-auto bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-gray-200 dark:border-white/10">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  {lesson?.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {lesson?.description}
                </p>
              </div>

              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-1 rounded-full text-sm font-medium w-fit">
                #{lesson?.id}
              </span>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <Calendar className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sana
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {lesson?.lessonDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <Clock className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vaqt
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {lesson?.startTime} - {lesson?.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <User className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    O‘qituvchi
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {lesson?.teacher.name} {lesson?.teacher.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <Users className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Guruh
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {lesson?.group.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 border-t pt-4 border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <BookOpen size={18} />
                <span>Dars tafsilotlari</span>
              </div>

              <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition">
                Tahrirlash
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonInfoPage;
