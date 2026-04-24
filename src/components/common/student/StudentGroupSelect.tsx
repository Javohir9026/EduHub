import apiClient from "@/api/ApiClient";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

interface GroupType {
  id: number;
  name: string;
}

interface StudentUpdateGroupSelectProps {
  value: string;
  onChange: (value: number) => void;
}

const StudentUpdateGroupSelect: React.FC<StudentUpdateGroupSelectProps> = ({
  value,
  onChange,
}) => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const getGroups = async () => {
    const api = import.meta.env.VITE_API_URL;
    try {
      setLoading(true);
      const response = await apiClient.get(
        `${api}/groups/learning-center/${localStorage.getItem("id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      setGroups(response.data.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
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

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedGroup = groups.find((g) => g.id.toString() === value);

  const handleSelect = (group: GroupType) => {
    onChange(group.id);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
          dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        <span
          className={
            selectedGroup
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-gray-500"
          }
        >
          {loading
            ? "Yuklanmoqda..."
            : selectedGroup
              ? selectedGroup.name
              : groups.length === 0
                ? "Guruhlar mavjud emas"
                : "Guruhni tanlang"}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform dark:text-gray-500 ${open ? "rotate-180" : ""}`}
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
                Guruh topilmadi
              </li>
            ) : (
              filtered.map((group) => (
                <li
                  key={group.id}
                  onClick={() => handleSelect(group)}
                  className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    ${
                      value === group.id.toString()
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                >
                  {group.name}
                  {value === group.id.toString() && (
                    <Check
                      size={14}
                      className="text-blue-700 dark:text-blue-400"
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentUpdateGroupSelect;
