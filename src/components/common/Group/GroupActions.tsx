import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, X, Loader2, MoreHorizontal, Users } from "lucide-react";
import StudentsSelect from "./StudentsSelect";
import StudentUpdateGroupSelect from "../student/StudentGroupSelect";
import { GroupCreateModal } from "./GroupCreateModal";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import type { Student } from "@/lib/types";
import apiClient from "@/api/ApiClient";
import { toast } from "sonner";

// Bu componentni ishlatayotgan parent "onRefetch" prop uzatsin:
// <GroupActions onRefetch={fetchTableData} />
interface GroupActionsProps {
  onRefetch?: () => void;
}

const GroupActions = ({ onRefetch }: GroupActionsProps) => {
  // --- dropdown (3 nuqta) state ---
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- Add Student modal state ---
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  // --- Group Create modal state ---
  const [groupCreateOpen, setGroupCreateOpen] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const isValid = groupId !== null && selectedStudents.length > 0;

  // 3-nuqta tashqarisiga bosilsa yopilsin
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGroupChange = (val: number) => {
    if (val !== groupId) {
      setSelectedStudents([]);
    }
    setGroupId(val);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      await apiClient.post(
        `${api}/students/add-to-group`,
        {
          groupId,
          studentIds: selectedStudents.map((s) => s.id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      toast.success("O'quvchilar guruhga muvaffaqiyatli qo'shildi!");
      handleStudentModalClose();
      onRefetch?.(); // table qaytadan fetch bo'lsin
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentModalClose = () => {
    setStudentModalOpen(false);
    setGroupId(null);
    setSelectedStudents([]);
  };

  return (
    <div className="flex items-center gap-2">
      {/* --- 3 nuqta button --- */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white
            hover:bg-gray-50 transition-colors cursor-pointer
            dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <MoreHorizontal
            size={18}
            className="text-gray-600 dark:text-gray-300"
          />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div
            className="absolute right-0 top-10 z-50 w-52 rounded-md border border-gray-200 bg-white shadow-lg
              dark:border-gray-700 dark:bg-gray-800"
          >
            {/* O'quvchi qo'shish */}
            <button
              onClick={() => {
                setMenuOpen(false);
                setStudentModalOpen(true);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50
                transition-colors cursor-pointer
                dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <UserPlus size={15} className="text-blue-500" />
              O'quvchi Qo'shish
            </button>

            {/* Guruh qo'shish */}
            <button
              onClick={() => {
                setMenuOpen(false);
                setGroupCreateOpen(true);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50
                transition-colors cursor-pointer
                dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Users size={15} className="text-green-500" />
              Guruh Qo'shish
            </button>
          </div>
        )}
      </div>

      {/* --- O'quvchi qo'shish modal --- */}
      <AlertDialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <AlertDialogHeader>
              <AlertDialogTitle className="dark:text-white">
                Guruhga O'quvchi Qo'shish
              </AlertDialogTitle>
            </AlertDialogHeader>

            <button
              onClick={handleStudentModalClose}
              className="flex cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100
              text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="dark:text-gray-300">1. Guruhni tanlang</Label>
              <StudentUpdateGroupSelect
                onChange={handleGroupChange}
                value={groupId ? groupId.toString() : ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                className={`transition-colors duration-200 ${
                  groupId
                    ? "dark:text-gray-300 text-gray-700"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                2. O'quvchilarni tanlang
                {!groupId && (
                  <span className="ml-2 text-xs font-normal italic">
                    (avval guruhni tanlang)
                  </span>
                )}
              </Label>

              <div
                className={`transition-all duration-200 ${
                  !groupId
                    ? "opacity-50 pointer-events-none select-none"
                    : "opacity-100"
                }`}
              >
                <StudentsSelect
                  selectedStudents={selectedStudents}
                  setSelectedStudents={setSelectedStudents}
                  groupId={groupId}
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel
              onClick={handleStudentModalClose}
              disabled={loading}
              className="cursor-pointer dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Bekor Qilish
            </AlertDialogCancel>

            <Button
              disabled={!isValid || loading}
              onClick={handleSave}
              className="bg-blue-500 text-white hover:bg-blue-400 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:bg-blue-600 dark:hover:bg-blue-500 min-w-[90px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Saqlanmoqda...
                </span>
              ) : (
                "Saqlash"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- Guruh qo'shish modal --- */}
      {groupCreateOpen && (
        <GroupCreateModal
          onSuccess={() => {
            onRefetch?.();
            setGroupCreateOpen(false);
          }}
          open={groupCreateOpen}
          onOpenChange={setGroupCreateOpen}
          classname="hidden"
        />
      )}
    </div>
  );
};

export default GroupActions;
