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
import { ListPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import GroupTeacherSelect from "./GroupTeacherSelect";
import { DatePickerCalendar } from "../DatePickerCalendar";
import { DatePickerTime } from "../TimePicker";

export function GroupCreateModal({
  classname,
  onSuccess,
}: {
  classname: string;
  onSuccess: () => void;
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

  const [errors, setErrors] = useState<any>({});

  // Validatsiya
  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name") {
      if (!value.trim()) return "Nomini kiriting!";
      if (value.trim().length < 3) return "Kamida 3 ta harf bo'lishi kerak!";
    }
    if (name === "startDate") {
      if (!value) return "Boshlang'ich sana kiriting!";
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return "Sana noto'g'ri!";
      }
    }
    if (name === "endDate") {
      if (!value) return "Tugash sana kiriting!";
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return "Sana noto'g'ri!";
      }
    }
    if (name === "lessonDays") {
      if (!value) return "O'quv kunlarini kiriting!";
    }
    if (name === "lessonTime") {
      if (!value) return "Boshlanish Vaqtini kiriting!";
    }
    if (name === "monthlyPrice") {
      if (!value) return "Oylik Summani kiriting!";
    }
    if (name === "maxStudents") {
      if (!value) return "O'quvchilar Sig'imi kiriting!!";
    }
    if (name === "room") {
      if (!value) return "Guruh Xonasini kiriting!!";
    }
    if (name === "groupId") {
      if (!value.trim()) return "Guruhni tanlang!";
    }
    return undefined;
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "lessonDays":
        setLessonDays(value);
        break;
      case "lessonTime":
        setLessonTime(value);
        break;
      case "monthlyPrice":
        setMonthlyPrice(value);
        break;
      case "maxStudents":
        setMaxStudents(value);
        break;
      case "room":
        setRoom(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "teacher_id":
        setTeacherId(value);
        break;
    }

    const error = validateField(field, value);

    setErrors((prev: any) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleCancel = () => {
    setOpen(false);
    setName("");
    setStartDate("");
    setEndDate("");
    setLessonDays("");
    setLessonTime("");
    setMonthlyPrice("");
    setMaxStudents("");
    setRoom("");
    setDescription("");
    setTeacherId("");
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = {
      name: validateField("name", name),
      startDate: validateField("startDate", startDate),
      endDate: validateField("endDate", endDate),
      lessonDays: validateField("lessonDays", lessonDays),
      lessonTime: validateField("lessonTime", lessonTime),
      monthlyPrice: validateField("monthlyPrice", monthlyPrice),
      maxStudents: validateField("maxStudents", maxStudents),
      room: validateField("room", room),
      teacher_id: validateField("teacher_id", teacher_id),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    try {
      setLoading(true);
      const numericPrice = Number(monthlyPrice.replace(/\,/g, ""));
      await apiClient.post(`${api}/groups`, {
        name,
        startDate,
        endDate,
        lessonDays,
        lessonTime,
        monthlyPrice: numericPrice,
        maxStudents: Number(maxStudents),
        room,
        description,
        learning_center_id: localStorage.getItem("id"),
        teacher_id: Number(teacher_id),
      });

      toast.success("Guruh qo'shildi!");
      onSuccess();
      handleCancel();
    } catch (error: any) {
      toast.error("Xatolik yuz berdi");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className={classname}>
          <ListPlus size={18} />
          <span className="hidden md:inline">Qo'shish</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Guruh qo'shish</AlertDialogTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full">
            {/* NAME */}
            <div className="flex flex-col gap-2">
              <Label>Guruh Nomi</Label>
              <Input
                value={name}
                placeholder="Guruh N1"
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* START DATE */}
            <div className="flex flex-col gap-2">
              <Label>Boshlanish Kuni</Label>
              <DatePickerCalendar
                onChange={(date) => handleChange("startDate", date)}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs">{errors.startDate}</p>
              )}
            </div>

            {/* END DATE */}
            <div className="flex flex-col gap-2">
              <Label>Tugash Kuni</Label>
              <DatePickerCalendar
                onChange={(date) => handleChange("endDate", date)}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs">{errors.endDate}</p>
              )}
            </div>

            {/* LESSON DAYS */}
            <div className="flex flex-col gap-2">
              <Label>O'qish Kunlari</Label>
              <Input
                value={lessonDays}
                placeholder="1-3-5 kunlari..."
                onChange={(e) => handleChange("lessonDays", e.target.value)}
              />
              {errors.lessonDays && (
                <p className="text-red-500 text-xs">{errors.lessonDays}</p>
              )}
            </div>

            {/* LESSON TIME */}
            <div className="flex flex-col gap-2">
              <Label>Boshlanish Vaqti</Label>
              <DatePickerTime
                onChange={(time) => handleChange("lessonTime", time)}
              />
              {errors.lessonTime && (
                <p className="text-red-500 text-xs">{errors.lessonTime}</p>
              )}
            </div>

            {/* MONTHLY PRICE */}
            <div className="flex flex-col gap-2">
              <Label>Oylik Summa</Label>
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
                <p className="text-red-500 text-xs">{errors.monthlyPrice}</p>
              )}
            </div>

            {/* MAX STUDENTS */}
            <div className="flex flex-col gap-2">
              <Label>Sig'imi</Label>
              <Input
                type="number"
                value={maxStudents}
                placeholder="30"
                onChange={(e) => handleChange("maxStudents", e.target.value)}
              />
              {errors.maxStudents && (
                <p className="text-red-500 text-xs">{errors.maxStudents}</p>
              )}
            </div>

            {/* ROOM */}
            <div className="flex flex-col gap-2">
              <Label>Guruh Xonasi</Label>
              <Input
                value={room}
                placeholder="200-xona"
                onChange={(e) => handleChange("room", e.target.value)}
              />
              {errors.room && (
                <p className="text-red-500 text-xs">{errors.room}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Qo'shimcha Ma'lumot</Label>
              <Input
                placeholder="Guruh qo'shimcha ma'lumotlari..."
                value={description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* TEACHER */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>O'qituvchi</Label>
              <GroupTeacherSelect
                value={teacher_id}
                onChange={(value) => handleChange("teacher_id", value)}
              />
              {errors.teacher_id && (
                <p className="text-red-500 text-xs">{errors.teacher_id}</p>
              )}
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="!bg-red-500 text-white hover:!bg-red-500/80"
          >
            Bekor qilish
          </AlertDialogCancel>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 text-white hover:bg-green-500/80"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
