import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, X, Loader2 } from "lucide-react";
import StudentsSelect from "./StudentsSelect";
import StudentUpdateGroupSelect from "../student/StudentGroupSelect";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import type { Student } from "@/lib/types";
import apiClient from "@/api/ApiClient";
import { toast } from "sonner";

interface AddStudentToGroupModalProps {
  onRefetch?: () => void;
}

const AddStudentToGroupModal = ({ onRefetch }: AddStudentToGroupModalProps) => {
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const isValid = groupId !== null && selectedStudents.length > 0;

  // onChange: (value: number) => void — StudentUpdateGroupSelect kutgan type
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
      const res = await apiClient.post(
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
      console.log(res);
      toast.success("O'quvchilar guruhga muvaffaqiyatli qo'shildi!");
      onRefetch?.();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setGroupId(null);
    setSelectedStudents([]);
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:bg-blue-400 hover:text-white dark:hover:bg-blue-600 cursor-pointer"
          >
            <UserPlus size={18} />
            <span className="hidden md:inline">O'quvchi Qo'shish</span>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <AlertDialogHeader>
              <AlertDialogTitle className="dark:text-white">
                Guruhga O'quvchi Qo'shish
              </AlertDialogTitle>
            </AlertDialogHeader>

            <button
              onClick={handleClose}
              className="flex cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100
              text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* 1-qadam: Guruhni tanlash */}
            <div className="flex flex-col gap-2">
              <Label className="dark:text-gray-300">1. Guruhni tanlang</Label>
              <StudentUpdateGroupSelect
                onChange={handleGroupChange}
                value={groupId ? groupId.toString() : ""}
              />
            </div>

            {/* 2-qadam: O'quvchilarni tanlash — faqat guruh tanlangandan keyin */}
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
                  groupId={groupId} // guruh ichidagi studentlarni kesib olish uchun
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel
              onClick={handleClose}
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
    </div>
  );
};

export default AddStudentToGroupModal;
