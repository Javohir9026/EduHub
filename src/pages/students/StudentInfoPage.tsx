import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { Link, useParams } from "react-router-dom";
import {
  Cake,
  GroupIcon,
  Home,
  PhoneCall,
  Trash,
  Voicemail,
} from "lucide-react";
import type { Student } from "@/lib/types";
import { Button } from "@/components/ui/button";
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

const StudentInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

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
  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Yuklanmoqda...</p>
      </div>
    );

  if (!student)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-bold text-xl">
        Student topilmadi
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-fullbg rounded-2xl shadow-lg p-6 flex flex-col items-center text-center gap-4">
        <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow">
          {student.fullName[0].toUpperCase()}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {student.fullName}
        </h1>

        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            student.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {student.isActive ? "Faol student" : "Faol emas"}
        </span>
        <StudentEditModal
          content="Tahrirlash"
          student={student}
          onSuccess={fetchStudent}
          classname=" dark:bg-blue-500 bg-blue-500 hover:bg-blue-500/80 hover:text-white cursor-pointer text-white rounded-lg  items-center justify-center gap-2"
        />
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer text-white rounded-lg flex items-center justify-center gap-2">
                <Trash className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>O'chirishni tasdiqlaysizmi?</AlertDialogTitle>
                <AlertDialogDescription>
                  Haqiqatdan ham ishonchingiz komilmi?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Bekor qilish
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={deletingId === student.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(student.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer text-white"
                >
                  {deletingId === student.id
                    ? "O'chirilmoqda..."
                    : "Ha, O'chirish"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {/* INFO SECTION */}

      <div className="md:col-span-2 grid sm:grid-cols-2 gap-5">
        <InfoCard icon={<PhoneCall />} label="Telefon" value={student.phone} />

        <InfoCard
          icon={<Voicemail />}
          label="Ota/onasi telefoni"
          value={student.parentPhone}
        />

        <InfoCard
          icon={<Cake />}
          label="Tug'ilgan sana"
          value={student.birthDate}
        />

        <InfoCard icon={<Home />} label="Manzil" value={student.address} full />

        {/* GROUPS */}

        <div className="bg-white dark:bg-fullbg rounded-xl shadow p-5 sm:col-span-2">
          <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
            <GroupIcon className="text-blue-500" />
            Guruhlar
          </p>

          <div className="flex flex-wrap gap-2">
            {student.groupStudents?.length ? (
              student.groupStudents.map((g) => (
                <Link
                  key={g.id}
                  to={`/group-info/${g.group.id}`}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition"
                >
                  {g.group.name}
                </Link>
              ))
            ) : (
              <p className="text-gray-400">Hech qanday guruh yo'q</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoPage;

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}

const InfoCard = ({ icon, label, value, full }: InfoCardProps) => {
  return (
    <div
      className={`bg-white dark:bg-fullbg rounded-xl shadow hover:shadow-md transition p-5 flex items-center gap-4 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <div className="text-blue-500">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};
