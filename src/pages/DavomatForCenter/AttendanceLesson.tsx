import apiClient from "@/api/ApiClient";
import { BreadcrumbBasic } from "@/components/common/BreadCrumb";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Lesson } from "./type";
import { toast } from "sonner";

type AttendanceItem = {
  studentId: number;
  status: "PRESENT" | "ABSENT";
};

const AttendanceLesson = () => {
  const [data, setData] = useState<Lesson | null>(null);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const hasStudents = data?.group.groupStudents?.length ? data.group.groupStudents.length > 0 : false;

  // 🔹 FETCH
  const fetchData = async () => {
    try {
      setLoading(true);

      const api = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("access_token");

      const res = await apiClient.get(`${api}/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 INIT STUDENTS
  useEffect(() => {
    if (data?.group.groupStudents) {
      const initial = data.group.groupStudents.map((gs) => ({
        studentId: gs.student.id,
        status: "ABSENT" as "PRESENT" | "ABSENT",
      }));
      setAttendance(initial);
    }
  }, [data]);

  // 🔹 STATUS CHANGE
  const handleStatusChange = (
    studentId: number,
    status: "PRESENT" | "ABSENT",
  ) => {
    setAttendance((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s)),
    );
  };

  // 🔹 SUBMIT
  const handleSubmit = async () => {
    try {
      const api = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("access_token");

      const payload = {
        groupId: data?.group.id,
        lessonId: data?.id,
        teacherId: data?.teacher.id,
        date: data?.lessonDate,
        students: attendance,
      };

      await apiClient.post(
        `${api}/attendances/learning-center/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Davomat saqlandi");
      navigate("/attendances-center");
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 SKELETON ITEM
  const SkeletonItem = () => (
    <div className="flex flex-col justify-between sm:flex-row gap-3 p-3 border rounded-xl animate-pulse">
      <div className="h-4 w-40 bg-gray-300 rounded"></div>
      <div className="flex gap-2 w-full sm:w-auto">
        <div className="h-9 flex-1 sm:w-20 bg-gray-300 rounded"></div>
        <div className="h-9 flex-1 sm:w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 mx-auto ">
      {/* 🔹 Breadcrumb */}
      <div className="flex justify-end mb-4">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Davomat", href: "/attendances-center" },
            {
              title: `${data?.name || "Dars"} Davomati`,
              href: `/attendance-lesson/${id}`,
            },
          ]}
        />
      </div>

      {/* 🔹 INFO */}
      {!loading && (
        <div className="mb-4 text-base sm:text-lg font-semibold">
          O'quvchilar soni: {data?.group.groupStudents.length}
        </div>
      )}

      {/* 🔹 EMPTY STATE */}
      {!loading && !hasStudents && (
        <div className="text-center text-gray-500 py-6">
          O'quvchilar mavjud emas
        </div>
      )}

      {/* 🔹 STUDENTS */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />)
          : hasStudents &&
            data?.group.groupStudents.map((gs) => {
              const current = attendance.find(
                (a) => a.studentId === gs.student.id,
              );

              return (
                <div
                  key={gs.student.id}
                  className="
                    flex flex-col sm:flex-row 
                    sm:items-center sm:justify-between
                    gap-3 p-3 border rounded-xl
                  "
                >
                  {/* Name */}
                  <div className="font-medium text-sm sm:text-base">
                    {gs.student.fullName}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        handleStatusChange(gs.student.id, "PRESENT")
                      }
                      className={`
                        flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm
                        ${
                          current?.status === "PRESENT"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200"
                        }
                      `}
                    >
                      Keldi
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(gs.student.id, "ABSENT")
                      }
                      className={`
                        flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm
                        ${
                          current?.status === "ABSENT"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200"
                        }
                      `}
                    >
                      Kelmadi
                    </button>
                  </div>
                </div>
              );
            })}
      </div>

      {/* 🔹 SUBMIT / BACK */}
      {!loading && (
        <div className="mt-6">
          {hasStudents ? (
            <button
              onClick={handleSubmit}
              className="
                w-full sm:w-auto
                bg-blue-600 text-white 
                px-5 py-3 sm:py-2 
                rounded-xl
              "
            >
              Saqlash
            </button>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="
                w-full sm:w-auto
                bg-gray-500 text-white 
                px-5 py-3 sm:py-2 
                rounded-xl
              "
            >
              Orqaga qaytish
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceLesson;
