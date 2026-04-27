import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/ApiClient";

// ================== TYPES ==================

type Overview = {
  groupCount: number;
  activeGroupCount: number;
  studentCount: number;
  lessonCount: number;
  todayLessons: number;
  upcomingLessons: number;
};

type Attendance = {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
};

type Lesson = {
  id: number;
  name: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  group: {
    id: number;
    name: string;
  };
};

type StatsResponse = {
  overview: Overview;
  attendance: Attendance;
  recentLessons: Lesson[];
};

// ================== API ==================

async function fetchStats(): Promise<StatsResponse> {
  const token = localStorage.getItem("access_token");
  const api = import.meta.env.VITE_API_URL;
  const teacherId = localStorage.getItem("id");

  const res = await apiClient.get<{ data: StatsResponse }>(
    `${api}/teachers/${teacherId}/statistics`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
}

// ================== COUNT ANIMATION ==================

function CountUp({
  target,
  active,
}: {
  target: number;
  active: boolean;
}) {
  const [val, setVal] = useState<number>(0);

  useEffect(() => {
    if (!active) return;

    let current = 0;
    const steps = 40;
    const increment = Math.ceil(target / steps);

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setVal(target);
        clearInterval(interval);
      } else {
        setVal(current);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [target, active]);

  return <>{val.toLocaleString("uz-UZ")}</>;
}

// ================== CARDS ==================

const CARDS: {
  key: keyof Overview;
  icon: string;
  label: string;
  color: string;
}[] = [
  {
    key: "studentCount",
    icon: "👨‍🎓",
    label: "O'quvchilar",
    color: "text-blue-600",
  },
  {
    key: "groupCount",
    icon: "📚",
    label: "Guruhlar",
    color: "text-emerald-600",
  },
  {
    key: "todayLessons",
    icon: "📅",
    label: "Bugungi darslar",
    color: "text-amber-600",
  },
  {
    key: "lessonCount",
    icon: "📖",
    label: "Jami darslar",
    color: "text-purple-600",
  },
];

// ================== SKELETON ==================

function SkeletonCard() {
  return (
    <div className="rounded-2xl border p-6 animate-pulse">
      <div className="h-10 w-10 bg-gray-200 mb-4 rounded" />
      <div className="h-8 w-20 bg-gray-200 mb-2 rounded" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
  );
}

// ================== MAIN ==================

export default function DashboardStats() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setVisible(false);

    try {
      const result = await fetchStats();
      setData(result);
      setTimeout(() => setVisible(true), 100);
    } catch (e) {
      setError("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard 📊
      </h1>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={load} className="underline text-sm">
            Qayta urinish
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : CARDS.map((card) => (
              <div
                key={card.key}
                className={`p-6 rounded-2xl border bg-white dark:bg-zinc-900 transition ${
                  visible ? "opacity-100" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="text-3xl">{card.icon}</div>

                <div className={`text-4xl font-bold ${card.color}`}>
                  <CountUp
                    target={data?.overview?.[card.key] ?? 0}
                    active={visible}
                  />
                </div>

                <p className="font-semibold mt-2">{card.label}</p>
              </div>
            ))}
      </div>

      {/* ATTENDANCE */}
      {!loading && data?.attendance && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Davomat statistikasi
          </h2>

          <div className="flex justify-between">
            <div>
              <p>Kelganlar</p>
              <p className="text-green-600 text-2xl font-bold">
                {data.attendance.presentCount}
              </p>
            </div>

            <div>
              <p>Kelmaganlar</p>
              <p className="text-red-600 text-2xl font-bold">
                {data.attendance.absentCount}
              </p>
            </div>

            <div>
              <p>Foiz</p>
              <p className="text-blue-600 text-2xl font-bold">
                {data.attendance.attendanceRate}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RECENT LESSONS */}
      {!loading && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border">
          <h2 className="text-xl font-semibold mb-4">
            So'nggi darslar
          </h2>

          {data?.recentLessons.length === 0 ? (
            <p className="text-gray-400">Ma'lumot yo‘q</p>
          ) : (
            <div className="space-y-3">
              {data?.recentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 border rounded-xl flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{lesson.name}</p>
                    <p className="text-sm text-gray-400">
                      {lesson.group.name}
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    <p>{lesson.lessonDate}</p>
                    <p>
                      {lesson.startTime} - {lesson.endTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}