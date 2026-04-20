import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";
import StudentsSelect from "./StudentsSelect";
import StudentUpdateGroupSelect from "../student/StudentGroupSelect";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import type { Student } from "@/lib/types";

const AddStudentToGroupModal = () => {
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  const isValid = groupId !== null && selectedStudents.length > 0;

  const handleSave = () => {
    const data = {
      groupId,
      studentIds: selectedStudents.map((s) => s.id),
    };
    console.log("Backend ga yuboriladigan data:", data);
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

        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700 ">
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
            <div className="flex flex-col gap-2">
              <Label className="dark:text-gray-300">Guruhni tanlang</Label>
              <StudentUpdateGroupSelect
                onChange={(val) => setGroupId(val)}
                value={groupId ? groupId.toString() : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="dark:text-gray-300">
                O'quvchilarni tanlang
              </Label>
              <StudentsSelect
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
              />
            </div>
          </div>

          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel
              onClick={handleClose}
              className="cursor-pointer dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Bekor Qilish
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!isValid}
              onClick={handleSave}
              className="bg-blue-500 text-white hover:bg-blue-400 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Saqlash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddStudentToGroupModal;
