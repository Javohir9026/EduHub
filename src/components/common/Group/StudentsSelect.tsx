import apiClient from "@/api/ApiClient";
import { useEffect, useRef, useState } from "react";
import type { Student } from "@/lib/types";
import { Check, ChevronDown, Search, X } from "lucide-react";
interface StudentsSelectProps {
  selectedStudents: Student[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}
const StudentsSelect = ({ selectedStudents, setSelectedStudents }: StudentsSelectProps) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchStudents = async () => {
    const api = import.meta.env.VITE_API_URL;
    const id = localStorage.getItem("id");
    try {
      setLoading(true);
      const res = await apiClient.get(`${api}/learning-centers/${id}/students`);
      setStudents(res.data.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = students.filter((s) =>
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
        onClick={() => setOpen((prev) => !prev)}
        className="min-h-10 w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 flex flex-wrap gap-1 items-center
          dark:border-gray-600 dark:bg-gray-800"
      >
        {selectedStudents.length === 0 ? (
          <span className="text-gray-400 text-sm dark:text-gray-500">
            Talabalarni tanlang...
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
        <ChevronDown
          size={16}
          className={`ml-auto text-gray-400 transition-transform dark:text-gray-500 ${open ? "rotate-180" : ""}`}
        />
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
            {loading ? (
              <li className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                Yuklanmoqda...
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                Talaba topilmadi
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
