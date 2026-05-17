import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Cake,
  Users,
  MapPin,
  Phone,
  PhoneCall,
  Trash2,
  ChevronRight,
  Home,
} from "lucide-react";
import type { Student } from "@/lib/types";
import { StudentEditModal } from "@/components/common/student/StudentEditModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const StudentInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const handleDelete = async (studentId: number) => {
    try {
      setDeletingId(studentId);
      const token = localStorage.getItem("access_token");
      const api = import.meta.env.VITE_API_URL;
      await apiClient.delete(`${api}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/students");
      toast.success("O'quvchi muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.error("Delete xatolik:", error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  /* ─── SKELETON ─── */
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-5 w-56 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="grid md:grid-cols-[280px_1fr] gap-6">
            {/* profile skeleton */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 flex flex-col items-center gap-4 border border-gray-100 dark:border-zinc-800">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-700" />
              <div className="h-5 w-36 bg-gray-200 dark:bg-zinc-700 rounded-full" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded-full" />
              <div className="w-full mt-2 space-y-3">
                <div className="h-10 w-full bg-gray-200 dark:bg-zinc-700 rounded-xl" />
                <div className="h-10 w-full bg-gray-200 dark:bg-zinc-700 rounded-xl" />
              </div>
            </div>
            {/* info skeleton */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-5 flex items-center gap-4 border border-gray-100 dark:border-zinc-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-700 flex-shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-700 rounded-full" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 rounded-full" />
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
                <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-700 rounded-full mb-4" />
                <div className="flex gap-2">
                  {[80, 64, 96].map((w) => (
                    <div
                      key={w}
                      className={`h-7 w-${w < 70 ? 16 : w < 80 ? 20 : 24} bg-gray-200 dark:bg-zinc-700 rounded-full`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!student)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-3">
          <div className="text-5xl">🔍</div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            O'quvchi topilmadi
          </p>
          <Link
            to="/students"
            className="text-sm text-blue-500 hover:underline"
          >
            Orqaga qaytish
          </Link>
        </div>
      </div>
    );

  const initials = student.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-zinc-500">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Bosh sahifa
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to="/students"
            className="hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            O'quvchilar
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 dark:text-zinc-300 font-medium">
            {student.fullName}
          </span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid md:grid-cols-[280px_1fr] gap-6 items-start">
          {/* ── Profile Card ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col items-center text-center gap-4 sticky top-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
                {initials}
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-zinc-900 ${
                  student.isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
            </div>

            {/* Name & status */}
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {student.fullName}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium ${
                  student.isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    student.isActive ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
                {student.isActive ? "Faol student" : "Faol emas"}
              </span>
            </div>

            <div className="w-full h-px bg-gray-100 dark:bg-zinc-800" />

            {/* Action buttons */}
            <div className="w-full space-y-2.5">
              <StudentEditModal
                content="Tahrirlash"
                student={student}
                onSuccess={fetchStudent}
                classname="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border border-red-100 dark:border-red-900/40">
                    <Trash2 className="w-4 h-4" />
                    O'chirish
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      O'chirishni tasdiqlaysizmi?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span className="font-medium text-gray-700 dark:text-zinc-300">
                        {student.fullName}
                      </span>{" "}
                      ni o'chirmoqchisiz. Bu amalni qaytarib bo'lmaydi.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl cursor-pointer">
                      Bekor qilish
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deletingId === student.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(student.id);
                      }}
                      className="rounded-xl bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    >
                      {deletingId === student.id ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          O'chirilmoqda...
                        </span>
                      ) : (
                        "Ha, o'chirish"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* ── Info Section ── */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard
              icon={<Phone className="w-5 h-5" />}
              label="Telefon raqam"
              value={student.phone}
              color="blue"
            />
            <InfoCard
              icon={<PhoneCall className="w-5 h-5" />}
              label="Ota/onasi telefoni"
              value={student.parentPhone}
              color="violet"
            />
            <InfoCard
              icon={<Cake className="w-5 h-5" />}
              label="Tug'ilgan sana"
              value={student.birthDate}
              color="amber"
            />
            <InfoCard
              icon={<MapPin className="w-5 h-5" />}
              label="Manzil"
              value={student.address}
              color="emerald"
            />

            {/* Groups */}
            <div className="sm:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                  Guruhlar
                </p>
                {student.groupStudents?.length ? (
                  <span className="ml-auto text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                    {student.groupStudents.length} ta
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {student.groupStudents?.length ? (
                  student.groupStudents.map((g) => (
                    <Link
                      key={g.id}
                      to={`/group-info/${g.group.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium transition-colors duration-150"
                    >
                      {g.group.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 dark:text-zinc-600 italic">
                    Hech qanday guruh yo'q
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoPage;

/* ─── InfoCard ─── */
type ColorKey = "blue" | "violet" | "amber" | "emerald";

const colorMap: Record<
  ColorKey,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    darkBg: "dark:bg-blue-900/20",
    darkText: "dark:text-blue-400",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-500",
    darkBg: "dark:bg-violet-900/20",
    darkText: "dark:text-violet-400",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-500",
    darkBg: "dark:bg-amber-900/20",
    darkText: "dark:text-amber-400",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-500",
    darkBg: "dark:bg-emerald-900/20",
    darkText: "dark:text-emerald-400",
  },
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: ColorKey;
}

const InfoCard = ({ icon, label, value, color = "blue" }: InfoCardProps) => {
  const c = colorMap[color];
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow duration-200">
      <div
        className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${c.bg} ${c.text} ${c.darkBg} ${c.darkText}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 dark:text-zinc-500 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 truncate">
          {value}
        </p>
      </div>
    </div>
  );
};
