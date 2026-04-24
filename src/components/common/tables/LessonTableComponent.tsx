import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import apiClient from "@/api/ApiClient";
import { useEffect, useState, useCallback } from "react";

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
import { useNavigate } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInput from "@/components/ui/SearchInput";
import { toast } from "sonner";
import { GroupCreateModal } from "../Group/GroupCreateModal";
import type { Lesson } from "../Lessons/type";

export default function LessonTableComponent() {
  const [tableData, setTableData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const centerId = localStorage.getItem("id");
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);

      const today = new Date();
      const endDate = today.toISOString().split("T")[0];

      const start = new Date();
      start.setDate(today.getDate() - 7);
      const startDate = start.toISOString().split("T")[0];

      const res = await apiClient.get(`${api}/lessons/range/`, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setTableData(res.data || []);
      console.log(res.data);
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, [api, centerId, token]);

  const handleDelete = async (id: string | number) => {
    try {
      setDeletingId(id);
      await apiClient.delete(`${api}/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Dars muvaffaqqiyatli o'chirildi!");
      await fetchGroups();
      setDeletingId(null);
    } catch (error) {
      console.log("O'chirishda xatolik:", error);
      setDeletingId(null);
    }
  };
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);
  const filteredData = tableData.filter((lesson) =>
    lesson.name.toLowerCase().includes(search.toLowerCase()) ||
    lesson.group.name.toLowerCase().includes(search.toLowerCase()) ||
    lesson.teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    lesson.teacher.lastName.toLowerCase().includes(search.toLowerCase()) ||
    lesson.lessonDate.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <h1 className="text-2xl sm:text-start text-center font-bold mb-2 sm:mb-0">
            Darslar
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

          {/* <GroupCreateModal
            onSuccess={fetchGroups}
            classname="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-500/80 cursor-pointer"
          /> */}
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
                  Dars Nomi
                </TableCell>
                <TableCell className="hidden sm:table-cell px-5 py-4 text-center whitespace-nowrap">
                  Guruh
                </TableCell>
                <TableCell className="hidden lg:table-cell px-5 py-4 text-center whitespace-nowrap">
                  O'qituvchi
                </TableCell>
                <TableCell className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap">
                  Dars Vaqti
                </TableCell>
                <TableCell className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap">
                  Dars Sanasi
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
                    {/* guruh nomi */}
                    <TableCell className="px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>

                    {/* o'quvchilar soni */}
                    <TableCell className="hidden md:table-cell px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>

                    {/* o'qish kunlari */}
                    <TableCell className="hidden lg:table-cell px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>

                    {/* boshlanish vaqti */}
                    <TableCell className="hidden xl:table-cell px-5 py-4">
                      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </TableCell>
                    
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
                currentData.map((lesson, idx) => (
                  <TableRow
                    key={lesson.id}
                    className={` text-start sm:text-center  border-b border-gray-200 dark:border-white/[0.05] last:border-b-0 ${
                      idx % 2 === 0
                        ? "bg-gray-50 dark:bg-white/5"
                        : "bg-white dark:bg-white/0"
                    } hover:bg-gray-100 dark:hover:bg-white/10`}
                  >
                    <TableCell className="px-5 py-4 whitespace-nowrap">
                      {lesson.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell px-5 py-4">
                      {lesson.group.name}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell px-5 py-4">
                      {lesson.teacher.name} {lesson.teacher.lastName}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell px-5 py-4">
                      {lesson.startTime} - {lesson.endTime}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell px-5 py-4">
                      {lesson.lessonDate}
                    </TableCell>
                    <TableCell className="px-5 py-4 flex sm:gap-2 justify-center">
                      {/* <GroupEditModal
                        group={lesson}
                        onSuccess={fetchGroups}
                        classname="hidden sm:flex dark:bg-blue-500 bg-blue-500 hover:bg-blue-500/80 hover:text-white cursor-pointer text-white rounded-lg  items-center justify-center gap-2"
                      /> */}
                      <Button
                        onClick={() => navigate(`/lesson-info/${lesson.id}`)}
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
                                disabled={deletingId === lesson.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(lesson.id);
                                }}
                                className="bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer text-white"
                              >
                                {deletingId === lesson.id
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
                    Guruhlar topilmadi
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
}
