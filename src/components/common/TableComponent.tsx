import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";

export default function BasicTableOne() {
  const [tableData, setTableData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const centerId = localStorage.getItem("id");

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
      console.log("ochirishda Xatolik", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="px-5 py-4">
                Ism Familiya
              </TableCell>
              <TableCell isHeader className="px-5 py-4">
                Telefon
              </TableCell>
              <TableCell isHeader className="px-5 py-4">
                Tug'ilgan Sana
              </TableCell>
              <TableCell isHeader className="px-5 py-4">
                Holati
              </TableCell>
              <TableCell isHeader className="px-5 py-4">
                Guruhlar
              </TableCell>
              <TableCell isHeader className="px-5 py-4">
                Qo'shimcha
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(6)].map((_, i) => (
                    <TableCell key={i} className="px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* DATA */}
            {!loading &&
              tableData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="px-5 py-4">
                    {student.fullName}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500">
                    {student.phone}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500">
                    {student.birthDate}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500">
                    {student.groupStudents?.length || 0} ta
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg cursor-pointer flex items-center gap-2 w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin w-4 h-4" />
                              Chiqilmoqda...
                            </>
                          ) : (
                            <>
                              <Trash className="w-4 h-4" />
                              <span>O'chirish</span>
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Chiqish</AlertDialogTitle>
                          <AlertDialogDescription>
                            Buyruqni tasdiqlashga ishonchingiz komilmi?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">
                            Yo'q, Bekor qilish
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg cursor-pointer flex items-center gap-2"
                            onClick={() => handleDelete(student.id)}
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
