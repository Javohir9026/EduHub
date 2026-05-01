// LessonEditModal.tsx
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, X } from "lucide-react";
import apiClient from "@/api/ApiClient";
import StudentUpdateGroupSelect from "../student/StudentGroupSelect";
import GroupTeacherSelect from "../Group/GroupTeacherSelect";
import type { Lesson } from "./type";
import { toast } from "sonner";

interface LessonEditModalProps {
  id: number;
  onSuccess?: () => void;
  style: "default" | "icon";
}

const EMPTY_FORM: Lesson = {
  id: 0,
  name: "",
  description: "",
  group: { id: 0, name: "" },
  teacher: { id: 0, name: "", lastName: "" },
  lessonDate: "",
  startTime: "",
  endTime: "",
};

export function LessonEditModal({
  id,
  onSuccess,
  style,
}: LessonEditModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Lesson>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchData = async () => {
    try {
      setFetching(true);
      const res = await apiClient.get(`/lessons/${id}`);
      const data = res.data.data;
      setForm({
        ...data,
        startTime: data.startTime?.slice(0, 5) ?? "",
        endTime: data.endTime?.slice(0, 5) ?? "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatTime = (raw: string) => {
    let value = raw.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) value = value.slice(0, 2) + ":" + value.slice(2);
    return value;
  };

  const isDisabled =
    !form.name.trim() ||
    !form.description.trim() ||
    !form.group.id ||
    !form.teacher.id ||
    !form.lessonDate ||
    !(form.startTime.length === 5) ||
    !(form.endTime.length === 5);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.patch(`/lessons/${id}`, {
        name: form.name,
        description: form.description,
        groupId: form.group.id,
        teacherId: form.teacher.id,
        lessonDate: form.lessonDate,
        startTime: form.startTime,
        endTime: form.endTime,
      });
      onSuccess?.();
      toast.success("Dars muvaffaqiyatli yangilandi");
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center hover:text-white h-9 cursor-pointer"
      >
        {style === "icon" ? <Pencil className="w-4 h-4 mr-1" /> : null}
        {style === "default" ? (
          <>
            <Pencil className="w-4 h-4 mr-1" />
            Tahrirlash
          </>
        ) : null}
      </Button>

      <AlertDialog open={open} onOpenChange={(val) => !val && handleClose()}>
        <AlertDialogContent className="max-w-lg">
          {/* Header with X button */}
          <div className="flex items-start justify-between">
            <AlertDialogHeader className="flex-1">
              <AlertDialogTitle>Darsni tahrirlash</AlertDialogTitle>
              <AlertDialogDescription>
                Dars ma'lumotlarini yangilang
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {fetching ? (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">
                  Dars nomi
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dars nomini kiriting"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">Tavsif</label>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tavsif kiriting"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">Guruh</label>
                  <StudentUpdateGroupSelect
                    value={form.group.id ? String(form.group.id) : ""}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        group: { ...prev.group, id: Number(value) },
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">
                    O'qituvchi
                  </label>
                  <GroupTeacherSelect
                    value={form.teacher.id ? String(form.teacher.id) : ""}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        teacher: { ...prev.teacher, id: Number(value) },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">
                  Dars sanasi
                </label>
                <Input
                  name="lessonDate"
                  type="date"
                  value={form.lessonDate}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">
                    Boshlanish vaqti
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="09:30"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startTime: formatTime(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">
                    Tugash vaqti
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="11:00"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        endTime: formatTime(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>
              Bekor qilish
            </AlertDialogCancel>
            <Button
              onClick={handleSave}
              disabled={loading || fetching || isDisabled}
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
