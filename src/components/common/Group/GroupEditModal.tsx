import apiClient from "@/api/ApiClient";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Group } from "@/lib/types";
import GroupTeacherSelect from "./GroupTeacherSelect";

export function GroupEditModal({
  classname,
  group,
  onSuccess,
}: {
  classname: string;
  group: Group;
  onSuccess?: () => void;
}) {
  const api = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lessonDays, setLessonDays] = useState("");
  const [lessonTime, setLessonTime] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [teacher_id, setTeacherId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (group && open) {
      setName(group.name || "");
      setLessonDays(String(group.lessonDays) || "");
      setLessonTime(group.lessonTime || "");
      const price = group.monthlyPrice
        ? Number(group.monthlyPrice).toString()
        : "";

      const formattedPrice = price
        ? new Intl.NumberFormat("uz-UZ").format(Number(price))
        : "";

      setMonthlyPrice(formattedPrice);
      setMaxStudents(String(group.maxStudents) || "");
      setRoom(group.room || "");
      setDescription(group.description || "");
      setTeacherId(String(group.teacher.id || ""));
      const formattedStartDate = group.startDate
        ? group.startDate.split("T")[0]
        : "";
      const formattedEndDate = group.endDate ? group.endDate.split("T")[0] : "";

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      setErrors({});
    }
  }, [group, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.fullName = "Guruh Nomini kiriting!";
    }
    if (!startDate.trim()) {
      newErrors.fullName = "Boshlanish sanasini kiriting!";
    }
    if (!endDate.trim()) {
      newErrors.fullName = "Tugash sanasini kiriting!";
    }
    if (!lessonDays.trim()) {
      newErrors.fullName = "O'qish Kunlarini kiriting!";
    }
    if (!lessonTime.trim()) {
      newErrors.fullName = "O'qish Vaqtini kiriting!";
    }
    if (!monthlyPrice.trim()) {
      newErrors.fullName = "Oylik Summani kiriting!";
    }
    if (!maxStudents.trim()) {
      newErrors.fullName = "O'quvchilar Sig'imini kiriting!";
    }
    if (!room.trim()) {
      newErrors.fullName = "Guruh Xonasini kiriting!";
    }

    if (!teacher_id) {
      newErrors.groupId = "O'qituvchini Tanlang!";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const numericPrice = Number(monthlyPrice.replace(/\D/g, "")).toFixed(1);
      setLoading(true);
      console.log(
        name,
        startDate,
        endDate,
        lessonDays,
        lessonTime,
        numericPrice,
        maxStudents,
        room,
        description,
        teacher_id,
      );
      await apiClient.patch(`${api}/groups/${group.id}`, {
        name,
        startDate,
        endDate,
        lessonDays,
        lessonTime,
        monthlyPrice: numericPrice,
        maxStudents,
        room,
        description,
        teacher_id: Number(teacher_id),
        learning_center_id: Number(localStorage.getItem("id")),
      });

      toast.success("Guruh yangilandi!");
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className={classname} variant="outline">
          <Pen className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Guruhni tahrirlash</AlertDialogTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
            {/* NAME */}
            <div className="flex flex-col gap-1">
              <Label>Guruh Nomi</Label>
              <Input
                value={name}
                placeholder="Guruh nomi"
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* START DATE */}
            <div className="flex flex-col gap-1">
              <Label>Boshlanish sanasi</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate && (
                <span className="text-red-500 text-sm">{errors.startDate}</span>
              )}
            </div>

            {/* END DATE */}
            <div className="flex flex-col gap-1">
              <Label>Tugash sanasi</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {errors.endDate && (
                <span className="text-red-500 text-sm">{errors.endDate}</span>
              )}
            </div>

            {/* LESSON DAYS */}
            <div className="flex flex-col gap-1">
              <Label>O'qish kunlari</Label>
              <Input
                value={lessonDays}
                placeholder="1-3-5 kunlari"
                onChange={(e) => setLessonDays(e.target.value)}
              />
              {errors.lessonDays && (
                <span className="text-red-500 text-sm">
                  {errors.lessonDays}
                </span>
              )}
            </div>

            {/* LESSON TIME */}
            <div className="flex flex-col gap-1">
              <Label>Boshlanish vaqti</Label>
              <Input
                type="time"
                value={lessonTime}
                onChange={(e) => setLessonTime(e.target.value)}
              />
              {errors.lessonTime && (
                <span className="text-red-500 text-sm">
                  {errors.lessonTime}
                </span>
              )}
            </div>

            {/* MONTHLY PRICE */}
            <div className="flex flex-col gap-1">
              <Label>Oylik summa</Label>
              <Input
                type="text"
                placeholder="3.000.000"
                value={monthlyPrice}
                onChange={(e) => {
                  const numeric = e.target.value.replace(/\D/g, "");
                  const formatted = numeric
                    ? new Intl.NumberFormat("uz-UZ").format(Number(numeric))
                    : "";
                  setMonthlyPrice(formatted);
                }}
              />
              {errors.monthlyPrice && (
                <span className="text-red-500 text-sm">
                  {errors.monthlyPrice}
                </span>
              )}
            </div>

            {/* MAX STUDENTS */}
            <div className="flex flex-col gap-1">
              <Label>O'quvchilar sig'imi</Label>
              <Input
                type="number"
                value={maxStudents}
                placeholder="30"
                onChange={(e) => setMaxStudents(e.target.value)}
              />
              {errors.maxStudents && (
                <span className="text-red-500 text-sm">
                  {errors.maxStudents}
                </span>
              )}
            </div>

            {/* ROOM */}
            <div className="flex flex-col gap-1">
              <Label>Guruh xonasi</Label>
              <Input
                value={room}
                placeholder="301-xona"
                onChange={(e) => setRoom(e.target.value)}
              />
              {errors.room && (
                <span className="text-red-500 text-sm">{errors.room}</span>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <Label>Qo'shimcha ma'lumot</Label>
              <Input
                value={description}
                placeholder="Guruh haqida qo'shimcha ma'lumot"
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
            </div>

            {/* TEACHER SELECT */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <Label>O'qituvchi</Label>
              <GroupTeacherSelect
                value={teacher_id}
                onChange={(val) => setTeacherId(val ?? "")}
              />
              {errors.teacher_id && (
                <span className="text-red-500 text-sm">
                  {errors.teacher_id}
                </span>
              )}
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Bekor qilish
          </AlertDialogCancel>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 cursor-pointer text-white hover:bg-green-600"
          >
            {loading ? "Saqlanmoqda..." : "Yangilash"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
