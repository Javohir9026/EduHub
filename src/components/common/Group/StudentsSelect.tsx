import apiClient from "@/api/ApiClient";
import { useEffect, useRef, useState } from "react";
import type { Student } from "@/lib/types";
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react";

interface StudentsSelectProps {
  selectedStudents: Student[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  groupId: number | null;
}

const StudentsSelect = ({
  selectedStudents,
  setSelectedStudents,
  groupId,
}: StudentsSelectProps) => {
  const [loading, setLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [groupStudentIds, setGroupStudentIds] = useState<Set<string>>(
    new Set(),
  );
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isDisabled = loading || groupLoading;

  // Barcha studentlarni yuklash
  const fetchAllStudents = async () => {
    const api = import.meta.env.VITE_API_URL;
    const id = localStorage.getItem("id");
    try {
      setLoading(true);
      const res = await apiClient.get(`${api}/learning-centers/${id}/students`);
      setAllStudents(res.data.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Guruh o'zgarganda — shu guruhdagi studentlarni yuklash (conflict oldini olish)
  const fetchGroupStudents = async (gId: number) => {
    const api = import.meta.env.VITE_API_URL;
    try {
      setGroupLoading(true);
      setOpen(false);
      const res = await apiClient.get(`${api}/groups/${gId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const groupStudents: unknown[] = res.data.data.groupStudents ?? [];

      // Turli response strukturalarini handle qilamiz:
      // 1) { id, fullName }         — to'g'ridan student object
      // 2) { student: { id, ... } } — nested student object
      // 3) { studentId: number }    — faqat ID field
      const ids = new Set<string>(
        groupStudents.map((item: unknown) => {
          const entry = item as Record<string, unknown>;
          if (entry.student && typeof entry.student === "object") {
            return String((entry.student as Record<string, unknown>).id);
          }
          if (entry.studentId !== undefined) {
            return String(entry.studentId);
          }
          return String(entry.id);
        }),
      );

      console.log("Group student IDs (debug):", ids);
      setGroupStudentIds(ids);
    } catch (error) {
      console.log(error);
      setGroupStudentIds(new Set());
    } finally {
      setGroupLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (groupId !== null) {
      fetchGroupStudents(groupId);
    } else {
      setGroupStudentIds(new Set());
    }
  }, [groupId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Guruhda allaqachon bor studentlarni olib tashlaymiz
  const availableStudents = allStudents.filter(
    (s) => !groupStudentIds.has(String(s.id)),
  );

  const filtered = availableStudents.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (student: Student) => {
    setSelectedStudents((prev) =>
      prev.find((s) => s.id === student.id)
        ? prev.filter((s) => s.id !== student.id)
        : [...prev, student],
    );
  };

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudents((prev) => prev.filter((s) => String(s.id) !== id));
  };

  const isSelected = (id: string) =>
    selectedStudents.some((s) => String(s.id) === id);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <div
        onClick={() => !isDisabled && setOpen((prev) => !prev)}
        className={`min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 flex flex-wrap gap-1 items-center
          dark:border-gray-600 dark:bg-gray-800
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {selectedStudents.length === 0 ? (
          <span className="text-gray-400 text-sm dark:text-gray-500">
            {groupLoading
              ? "Guruh tekshirilmoqda..."
              : loading
                ? "Yuklanmoqda..."
                : "O'quvchilarni tanlang..."}
          </span>
        ) : (
          selectedStudents.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs rounded px-2 py-0.5
                dark:bg-blue-900/30 dark:text-blue-400"
            >
              {s.fullName}
              <X
                size={12}
                className="cursor-pointer hover:text-red-500 dark:hover:text-red-400"
                onClick={(e) => remove(String(s.id), e)}
              />
            </span>
          ))
        )}
        {isDisabled ? (
          <Loader2
            size={16}
            className="ml-auto text-gray-400 animate-spin dark:text-gray-500"
          />
        ) : (
          <ChevronDown
            size={16}
            className={`ml-auto text-gray-400 transition-transform dark:text-gray-500 ${open ? "rotate-180" : ""}`}
          />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg
          dark:border-gray-700 dark:bg-gray-800"
        >
          {/* Search */}
          <div className="flex items-center gap-2 border-b px-3 py-2 dark:border-gray-700">
            <Search size={14} className="text-gray-400 dark:text-gray-500" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400
                dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Options */}
          <ul className="max-h-52 overflow-y-auto">
            {loading || groupLoading ? (
              <li className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                <Loader2 size={14} className="animate-spin" />
                {groupLoading ? "Guruh tekshirilmoqda..." : "Yuklanmoqda..."}
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                {availableStudents.length === 0 && allStudents.length > 0
                  ? "Barcha o'quvchilar bu guruhda mavjud"
                  : "O'quvchi topilmadi"}
              </li>
            ) : (
              filtered.map((student) => (
                <li
                  key={student.id}
                  onClick={() => toggle(student)}
                  className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    ${
                      isSelected(String(student.id))
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                >
                  {student.fullName}
                  {isSelected(String(student.id)) && (
                    <Check
                      size={14}
                      className="text-blue-700 dark:text-blue-400"
                    />
                  )}
                </li>
              ))
            )}
          </ul>

          {/* Footer */}
          {selectedStudents.length > 0 && (
            <div className="border-t px-4 py-2 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
              {selectedStudents.length} ta tanlandi
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsSelect;
