import { useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import { useParams } from "react-router-dom";
import { Phone, Mail, User, Book, DollarSign, Trash } from "lucide-react";
import { TeacherEditModal } from "@/components/common/teacher/TeacherEditModal";
import type { Teacher } from "@/lib/types";

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

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

const TeacherInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  useEffect(() => {
    if (id) fetchTeacher();
  }, [id]);

  const handleDelete = async (teacherId: number) => {
    try {
      setDeletingId(teacherId);

      const token = localStorage.getItem("access_token");
      const api = import.meta.env.VITE_API_URL;

      await apiClient.delete(`${api}/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("O'qituvchi Muvaffaqiyatli o'chirildi");
      window.location.href = "/teachers";
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-8 animate-pulse">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>

          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-300 dark:bg-gray-700 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold">
        O'qituvchi topilmadi
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "O'qituvchilar", href: "/teachers" },
            {
              title: teacher.name + " " + teacher.lastName,
              href: `/teacher-info/${teacher.id}`,
            },
          ]}
        />
      </div>
      <div className="min-h-screen py-3 space-y-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex w-32 h-32 rounded-full bg-blue-400 items-center justify-center text-5xl font-bold shadow-lg">
              {teacher.name[0].toUpperCase()}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold">
                {teacher.name} {teacher.lastName}
              </h1>

              <p className="mt-2 text-blue-100 text-lg">
                Fan: {teacher.subject}
              </p>

              <span className="bg-white/20 px-4 py-1 rounded-full text-sm mt-3 inline-block">
                {teacher.role}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <TeacherEditModal
              teacher={teacher}
              content="Tahrirlash"
              onSuccess={fetchTeacher}
              classname="flex bg-blue-500 hover:bg-blue-600 hover:text-white text-white cursor-pointer rounded-lg px-4 py-2 items-center justify-center gap-2"
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center gap-2">
                  <Trash className="w-4 h-4" />
                  O'chirish
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    O'chirishni tasdiqlaysizmi?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    Haqiqatdan ham o'chirmoqchimisiz?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Bekor qilish
                  </AlertDialogCancel>

                  <AlertDialogAction
                    disabled={deletingId === teacher.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(teacher.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    {deletingId === teacher.id
                      ? "O'chirilmoqda..."
                      : "Ha, O'chirish"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
            {Number(teacher.salary).toLocaleString("de-DE")} so'm
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

/* INFO CARD */
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

export default TeacherInfoPage;
