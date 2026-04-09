import { useCallback, useEffect, useState } from "react";
import type { Attendance } from "./types";
import apiClient from "@/api/ApiClient";
import SearchInput from "@/components/ui/SearchInput";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentCreateModal } from "../student/StudentCreateModal";
import { Info, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
const AllAttendances = () => {
  const [tableData, setTableData] = useState<Attendance[]>([]);
  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiClient.get(
        `${api}/attendances/learning-center/findAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("attendance", res);

      // 🔥 qo‘shildi
      setTableData(res.data || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [api, token]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleDelete = async (id: string | number) => {
    try {
      setDeletingId(id);
      await apiClient.delete(`${api}/attendances/learning-center/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
      setDeletingId(null);
      toast.success("Davomat Muvaffaqiyatli O'chirildi!");
    } catch (error) {
      console.log("O'chirishda xatolik:", error);
      setDeletingId(null);
    }
  };
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = tableData.filter(
    (attendance) =>
      attendance.group.name.toLowerCase().includes(search.toLowerCase()) ||
      attendance.student.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      attendance.teacher.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      attendance.date.toLowerCase().includes(search.toLowerCase()) ||
      attendance.status.toLowerCase().includes(search.toLowerCase()) ||
      attendance.lesson.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, search]);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <h1 className="text-2xl sm:text-start text-center font-bold mb-2 sm:mb-0">
            Barcha Davomatlar
          </h1>

          <SearchInput
            placeholder="Qidirish..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-between">
          <Select
            onValueChange={(value) => setItemsPerPage(Number(value))}
            defaultValue="5"
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={`${itemsPerPage} ta`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-center">
                <TableCell
                  isHeader
                  className="px-4 py-4 whitespace-nowrap text-start sm:text-center"
                >
                  Guruh Nomi
                </TableCell>
                <TableCell className="hidden md:table-cell px-5 py-4 text-center whitespace-nowrap">
                  Mavzu
                </TableCell>
                <TableCell className="hidden lg:table-cell px-5 py-4 text-center whitespace-nowrap">
                  Sana
                </TableCell>
                <TableCell className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap">
                  Holati
                </TableCell>
                <TableCell className="px-5 py-4 whitespace-nowrap text-center">
                  Qo'shimcha
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading &&
                [...Array(itemsPerPage)].map((_, index) => (
                  <TableRow
                    key={index}
                    className="text-center border-b h-[70px] border-gray-200 dark:border-white/[0.05] last:border-b-0"
                  >
                    {/* Ism Familiya */}
                    <TableCell className="px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>

                    {/* Telefon */}
                    <TableCell className="hidden md:table-cell px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>

                    {/* Tug'ilgan sana */}
                    <TableCell className="hidden lg:table-cell px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>

                    {/* Holati */}
                    <TableCell className="hidden xl:table-cell px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>

                    {/* Qo'shimcha */}
                    <TableCell className="px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading &&
                currentData.map((attendance, idx) => (
                  <TableRow
                    key={attendance.id}
                    className={` text-start sm:text-center  border-b border-gray-200 dark:border-white/[0.05] last:border-b-0 ${
                      idx % 2 === 0
                        ? "bg-gray-50 dark:bg-white/5"
                        : "bg-white dark:bg-white/0"
                    } hover:bg-gray-100 dark:hover:bg-white/10`}
                  >
                    <TableCell className="px-5 py-4 whitespace-nowrap">
                      {attendance.group.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell px-5 py-4">
                      {attendance.lesson.name}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-5 py-4">
                      {attendance.lesson.lessonDate}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                          attendance.status === "PRESENT"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {attendance.status === "PRESENT"
                          ? "Olingan"
                          : "Olinmagan"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 flex sm:gap-2 justify-center">
                      {/* <StudentEditModal
                        student={student}
                        onSuccess={fetchStudents}
                        classname="hidden sm:flex dark:bg-blue-500 bg-blue-500 hover:bg-blue-500/80 hover:text-white cursor-pointer text-white rounded-lg  items-center justify-center gap-2"
                      /> */}
                      <Button
                        onClick={() =>
                          navigate(`/attendance-info/${attendance.id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-500/80 hover:text-white cursor-pointer text-white rounded-lg flex items-center justify-center gap-2"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                      <div className="hidden sm:block">
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
                              <AlertDialogCancel className="cursor-pointer">
                                Bekor qilish
                              </AlertDialogCancel>
                              <AlertDialogAction
                                disabled={deletingId === attendance.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(attendance.id);
                                }}
                                className="bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer text-white"
                              >
                                {deletingId === attendance.id
                                  ? "O'chirilmoqda..."
                                  : "Ha, O'chirish"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Davomatlar topilmadi!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AllAttendances;
