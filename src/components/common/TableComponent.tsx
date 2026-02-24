import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import apiClient from "@/api/ApiClient";
import { useEffect, useState } from "react";
import type { Student } from "@/lib/types";

export default function BasicTableOne() {
  const [tableData, setTableData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const api = import.meta.env.VITE_API_URL;

      const res = await apiClient.get(
        `${api}/students/learning-center/${localStorage.getItem("id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setTableData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="table-fixed w-full">
          {/* TABLE HEADER */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ism Familiya
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Telefon Raqam
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tug'ilgan Sana
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Holati
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Guruhlar Soni
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Qo'shimcha
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* TABLE BODY */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {/* LOADER */}
            {loading &&
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4">
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-5 py-4 flex  gap-2 ">
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}

            {/* DATA */}
            {!loading &&
              tableData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="px-5 py-4 text-start">
                    {student.fullName}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.phone}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.birthDate}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start">
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

                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.groupStudents?.length || 0} ta
                  </TableCell>
                </TableRow>
              ))}

            {/* EMPTY STATE */}
            {!loading && tableData.length === 0 && (
              <div className=" border border-red-500 text-center flex justify-center w-full items-center h-[400px]">
                <h1>Studentlar Topilmadi!</h1>
              </div>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
