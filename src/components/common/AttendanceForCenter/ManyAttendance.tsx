import { useCallback, useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Group } from "./TypesGroup";
import LessonCreateModal from "./LessonCreateModal";
const ManyAttendance = () => {
  const [tableData, setTableData] = useState<Group[]>([]);
  const api = import.meta.env.VITE_API_URL;
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("access_token");
  const today = new Date();

  const days = [
    "YAKSHANBA",
    "DUSHANBA",
    "SESHANBA",
    "CHORSHANBA",
    "PAYSHANBA",
    "JUMA",
    "SHANBA",
  ];

  const todayName = days[today.getDay()];
  const [openModal, setOpenModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiClient.get(`${api}/groups/learning-center/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.data);
      setTableData(res.data.data || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [api, token]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = tableData.filter((group) => {
    const lessonDaysArray = group.lessonDays
      ?.split(",")
      .map((day) => day.trim());

    // bugungi kunga mosligini tekshirish
    const isTodayLesson = lessonDaysArray?.includes(todayName);

    // search filter
    const matchesSearch =
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.lessonTime.toLowerCase().includes(search.toLowerCase()) ||
      group.currentStudents.toString().includes(search) ||
      group.room.toLowerCase().includes(search.toLowerCase());

    return isTodayLesson && matchesSearch;
  });
  console.log(todayName);
  console.log(filteredData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, search]);
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <h1 className="text-2xl sm:text-start text-center font-bold mb-2 sm:mb-0">
            Bugungi Davomatlar
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
                  Boshlanish vaqti
                </TableCell>
                <TableCell className="hidden lg:table-cell px-5 py-4 text-center whitespace-nowrap">
                  O'quvchilar soni
                </TableCell>
                <TableCell className="hidden xl:table-cell px-5 py-4 text-center whitespace-nowrap">
                  Xona
                </TableCell>
                <TableCell className="px-5 py-4 text-center whitespace-nowrap">
                  Status
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
                currentData.map((group, idx) => {
                  const todayDate = new Date().toISOString().slice(0, 10);

                  const todayLesson = group.lessons?.find(
                    (lesson) => lesson.lessonDate === todayDate,
                  );

                  return (
                    <TableRow
                      key={group.id}
                      className={` text-start sm:text-center  border-b border-gray-200 dark:border-white/[0.05] last:border-b-0 ${
                        idx % 2 === 0
                          ? "bg-gray-50 dark:bg-white/5"
                          : "bg-white dark:bg-white/0"
                      } hover:bg-gray-100 dark:hover:bg-white/10`}
                    >
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        {group.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell px-5 py-4">
                        {group.lessonTime.slice(0, 5)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-5 py-4">
                        {group.groupStudents.length}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell px-5 py-4">
                        {group.room}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        {todayLesson ? (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
                            Olingan
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
                            Olinmagan
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 flex sm:gap-2 justify-center">
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            {
                              todayLesson &&
                                navigate(`/attendance-lesson/${todayLesson.id}`);
                            }
                            setSelectedGroup(group);
                            setOpenModal(true);
                          }}
                          className="bg-blue-500 hover:text-white hover:bg-blue-400 dark:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 cursor-pointer text-white"
                        >
                          Davomat
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {!loading && filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Bugungi Darslar topilmadi!
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
      {selectedGroup && (
        <LessonCreateModal
          open={openModal}
          setOpen={setOpenModal}
          data={{
            group: selectedGroup.name || "",
            groupId: selectedGroup.id || 0,
            teacherId: selectedGroup.teacher.id || 0,
            teacher:
              selectedGroup.teacher.name +
                " " +
                selectedGroup.teacher.lastName || "",
            lessonDate: new Date().toISOString().slice(0, 10),
            startTime: selectedGroup.lessonTime,
          }}
          onSuccess={(lessonId) => {
            navigate(`/attendance-lesson/${lessonId}`);
          }}
        />
      )}
    </div>
  );
};

export default ManyAttendance;
