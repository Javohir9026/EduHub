import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/apiClient"; // 🔁 o'zingdagi path

// ✅ REAL API FUNCTION (TO'G'RILANGAN)
async function fetchStats() {
  const token = localStorage.getItem("access_token");
  const api = import.meta.env.VITE_API_URL;
  const teacherId = localStorage.getItem("id");

  const res = await apiClient.get(
    `${api}/teachers/${teacherId}/statistics`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const overview = res?.data?.data?.overview;

  return {
    students: overview?.studentCount ?? 0,
    groups: overview?.groupCount ?? 0,
    classes: overview?.todayLessons ?? 0,
  };
}

// 🔢 COUNT ANIMATION
function CountUp({ target, active }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;

    setVal(0);
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

// 🎨 CARD CONFIG
const CARDS = [
  {
    key: "students",
    icon: "👨‍🎓",
    label: "O'quvchilar soni",
    sublabel: "Total students",
    numColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "groups",
    icon: "📚",
    label: "Guruhlar soni",
    sublabel: "Total groups",
    numColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "classes",
    icon: "📅",
    label: "Bugungi darslar",
    sublabel: "Today's classes",
    numColor: "text-amber-600 dark:text-amber-400",
  },
];

// ⏳ LOADING
function SkeletonCard() {
  return (
    <div className="rounded-2xl border p-6 animate-pulse">
      <div className="h-10 w-10 bg-gray-200 mb-4 rounded" />
      <div className="h-8 w-20 bg-gray-200 mb-2 rounded" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
  );
}

// 🚀 MAIN
export default function DashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setVisible(false);

    try {
      const result = await fetchStats();
      setData(result);
      setTimeout(() => setVisible(true), 50);
    } catch (e) {
      setError(e.message || "Xatolik yuz berdi");
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

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : CARDS.map((card) => (
              <div
                key={card.key}
                className={`p-6 rounded-2xl border bg-white dark:bg-zinc-900 transition ${
                  visible ? "opacity-100" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="text-3xl mb-2">{card.icon}</div>

                <div className={`text-4xl font-bold ${card.numColor}`}>
                  <CountUp
                    target={data?.[card.key] || 0}
                    active={visible}
                  />
                </div>

                <p className="font-semibold mt-2">{card.label}</p>
                <p className="text-xs text-gray-400">
                  {card.sublabel}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}