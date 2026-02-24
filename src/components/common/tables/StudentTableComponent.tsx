import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import apiClient from "@/api/ApiClient";
import { useEffect, useState, useCallback } from "react";
import type { Student } from "@/lib/types";

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
} from "../../ui/alert-dialog";

import { Button } from "../../ui/button";
import { Info, Trash } from "lucide-react";
import { StudentEditModal } from "../student/StudentEditModal";
import { useNavigate } from "react-router-dom";

export default function BasicTableOne() {
  const [tableData, setTableData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const centerId = localStorage.getItem("id");
  const navigate = useNavigate();
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiClient.get(
        `${api}/students/learning-center/${centerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTableData(res.data.data || []);
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, [api, centerId, token]);

  const handleDelete = async (id: string | number) => {
    try {
      await apiClient.delete(`${api}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudents();
    } catch (error) {
      console.log("O‘chirishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full">
          {/* HEADER */}
          <TableHeader>
            <TableRow className="text-center">
              <TableCell
                isHeader
                className="px-5 py-4 whitespace-nowrap text-center"
              >
                Ism Familiya
              </TableCell>

              <TableCell
                isHeader
                className="hidden md:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                Telefon
              </TableCell>

              <TableCell
                isHeader
                className="hidden lg:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                Tug'ilgan sana
              </TableCell>

              <TableCell
                isHeader
                className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                Holati
              </TableCell>

              <TableCell
                isHeader
                className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap"
              >
                Guruhlar
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 whitespace-nowrap text-center"
              >
                Qo'shimcha
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* SKELETON */}
            {loading &&
              [...Array(5)].map((_, index) => (
                <TableRow key={index} className="text-center">
                  <TableCell className="px-5 py-4">
                    <div className="h-6 w-full mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell px-5 py-4">
                    <div className="h-6 w-full mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell px-5 py-4">
                    <div className="h-6 w-full mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell px-5 py-4">
                    <div className="h-6 w-full mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell px-5 py-4">
                    <div className="h-6 w-full mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="px-5 py-4 flex justify-center">
                    <div className="h-8 w-10 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-10 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-10 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}

            {/* DATA */}
            {!loading &&
              tableData.map((student) => (
                <TableRow key={student.id} className="text-center">
                  <TableCell className="px-5 py-4 whitespace-nowrap">
                    {student.fullName}
                  </TableCell>

                  <TableCell className="hidden md:table-cell px-5 py-4">
                    {student.phone}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell px-5 py-4">
                    {student.birthDate}
                  </TableCell>

                  <TableCell className="hidden xl:table-cell px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        student.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell className="hidden xl:table-cell px-5 py-4">
                    {student.groupStudents?.length || 0} ta
                  </TableCell>

                  <TableCell className="px-5 py-4 flex gap-2 justify-center">
                    <StudentEditModal
                      student={student}
                      onSuccess={fetchStudents}
                      classname="bg-blue-500 hover:bg-blue-500/80 hover:text-white cursor-pointer text-white rounded-lg flex items-center justify-center gap-2"
                    />
                    <Button
                      onClick={() => navigate(`/student-info/${student.id}`)}
                      className="bg-blue-500 hover:bg-blue-500/80 hover:text-white cursor-pointer text-white rounded-lg flex items-center justify-center gap-2"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer text-white rounded-lg flex items-center justify-center gap-2">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            O'chirishni tasdiqlaysizmi?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Haqiqatdan ham ishonchingiz komilmi?
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(student.id)}
                            className="bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer text-white"
                          >
                            Ha, O'chirish
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}

            {/* EMPTY */}
            {!loading && tableData.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-6 text-gray-500">
                  Studentlar topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
