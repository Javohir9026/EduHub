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
import { X } from "lucide-react";

export function GroupCreateModal({
  classname,
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  classname: string;
  onSuccess: () => void;
  open?: boolean;
  onOpenChange?: (val: boolean) => void;
}) {
  const api = import.meta.env.VITE_API_URL;

  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Agar tashqaridan open berilsa — uni ishlatamiz, aks holda ichki state
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled) {
      externalOnOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
  };

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lessonDays, setLessonDays] = useState<number[]>([]);
  const [daysModal, setDaysModal] = useState(false);
  const [lessonTime, setLessonTime] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [teacher_id, setTeacherId] = useState("");
  const [errors, setErrors] = useState<any>({});

  const DAYS = [
    { id: 1, label: "Dushanba" },
    { id: 2, label: "Seshanba" },
    { id: 3, label: "Chorshanba" },
    { id: 4, label: "Payshanba" },
    { id: 5, label: "Juma" },
    { id: 6, label: "Shanba" },
    { id: 7, label: "Yakshanba" },
  ];

  const validateField = (name: string, value: any): string | undefined => {
    if (name === "name") {
      if (!value.trim()) return "Nomini kiriting!";
      if (value.trim().length < 3) return "Kamida 3 ta harf bo'lishi kerak!";
    }
    if (name === "startDate" && !value) return "Boshlang'ich sana kiriting!";
    if (name === "endDate" && !value) return "Tugash sana kiriting!";
    if (name === "lessonDays" && !lessonDays.length)
      return "O'quv kunlarini tanlang!";
    if (name === "lessonTime" && !value) return "Boshlanish vaqtini kiriting!";
    if (name === "monthlyPrice" && !value) return "Oylik summani kiriting!";
    if (name === "maxStudents" && !value) return "Sig'im kiriting!";
    if (name === "room" && !value) return "Xona kiriting!";
    if (name === "teacher_id" && !value) return "O'qituvchi tanlang!";
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
    setErrors((prev: any) => ({ ...prev, [field]: error }));
  };

  const handleCancel = () => {
    setOpen(false);
    setName("");
    setStartDate("");
    setEndDate("");
    setLessonDays([]);
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
    if (Object.values(newErrors).some((e) => e)) return;

    try {
      setLoading(true);
      const numericPrice = Number(monthlyPrice.replace(/\D/g, ""));
      const formattedDays = lessonDays
        .map((d) => DAYS.find((day) => day.id === d)?.label?.toUpperCase())
        .join(", ");

      await apiClient.post(`${api}/groups`, {
        name,
        startDate,
        endDate,
        lessonDays: formattedDays,
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
    } catch (error) {
      toast.error("Xatolik yuz berdi");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* Trigger faqat classname berilganda va controlled bo'lmaganda ko'rinadi */}
        {!isControlled && (
          <AlertDialogTrigger asChild>
            <button className={classname}>
              <ListPlus size={18} />
              <span className="hidden md:inline">Qo'shish</span>
            </button>
          </AlertDialogTrigger>
        )}

        <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Guruh qo'shish</AlertDialogTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full">
              <div className="flex flex-col gap-2">
                <Label>Guruh Nomi</Label>
                <Input
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Boshlanish Kuni</Label>
                <DatePickerCalendar
                  onChange={(date) => handleChange("startDate", date)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Tugash Kuni</Label>
                <DatePickerCalendar
                  onChange={(date) => handleChange("endDate", date)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>O'qish Kunlari</Label>
                <Input
                  readOnly
                  value={
                    lessonDays.length
                      ? lessonDays
                          .map((d) => DAYS.find((day) => day.id === d)?.label)
                          .join(", ")
                      : ""
                  }
                  placeholder="1-3-5 kunlari..."
                  onClick={() => setDaysModal(true)}
                />
                {errors.lessonDays && (
                  <p className="text-red-500 text-xs">{errors.lessonDays}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Boshlanish Vaqti</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="09:30"
                  value={lessonTime}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 4) value = value.slice(0, 4);
                    if (value.length >= 3)
                      value = value.slice(0, 2) + ":" + value.slice(2);
                    handleChange("lessonTime", value);
                  }}
                />
                {errors.lessonTime && (
                  <p className="text-red-500 text-xs">{errors.lessonTime}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Oylik Summa (uzs)</Label>
                <Input
                  value={monthlyPrice}
                  onChange={(e) => {
                    const num = e.target.value.replace(/\D/g, "");
                    setMonthlyPrice(
                      num
                        ? new Intl.NumberFormat("uz-UZ").format(Number(num))
                        : "",
                    );
                  }}
                />
                {errors.monthlyPrice && (
                  <p className="text-red-500 text-xs">{errors.monthlyPrice}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Sig'im</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={maxStudents}
                  placeholder="30"
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    handleChange("maxStudents", onlyNumbers);
                  }}
                />
                {errors.maxStudents && (
                  <p className="text-red-500 text-xs">{errors.maxStudents}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Xona</Label>
                <Input
                  value={room}
                  onChange={(e) => handleChange("room", e.target.value)}
                />
                {errors.room && (
                  <p className="text-red-500 text-xs">{errors.room}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>O'qituvchi</Label>
                <GroupTeacherSelect
                  value={teacher_id}
                  onChange={(v) => handleChange("teacher_id", v)}
                />
                {errors.teacher_id && (
                  <p className="text-red-500 text-xs">{errors.teacher_id}</p>
                )}
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Bekor qilish
            </AlertDialogCancel>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DAYS MODAL */}
      <AlertDialog open={daysModal} onOpenChange={setDaysModal}>
        <AlertDialogContent>
          <div className="relative">
            <button
              onClick={() => setDaysModal(false)}
              className="absolute top-3 cursor-pointer right-3 p-1 rounded-md hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Kunlarni tanlang</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-1">
            {DAYS.map((day) => (
              <label key={day.id} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={lessonDays.includes(day.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLessonDays([...lessonDays, day.id]);
                    } else {
                      setLessonDays(lessonDays.filter((d) => d !== day.id));
                    }
                  }}
                />
                {day.label}
              </label>
            ))}
          </div>
          <AlertDialogFooter>
            <Button
              className="cursor-pointer"
              onClick={() => setDaysModal(false)}
            >
              Saqlash
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
