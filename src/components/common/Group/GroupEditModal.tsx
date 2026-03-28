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
import { Pen, X } from "lucide-react";
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

  const [lessonDays, setLessonDays] = useState<number[]>([]);
  const [daysModal, setDaysModal] = useState(false);

  const [lessonTime, setLessonTime] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [teacher_id, setTeacherId] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const DAYS = [
    { id: 1, label: "Dushanba" },
    { id: 2, label: "Seshanba" },
    { id: 3, label: "Chorshanba" },
    { id: 4, label: "Payshanba" },
    { id: 5, label: "Juma" },
    { id: 6, label: "Shanba" },
    { id: 7, label: "Yakshanba" },
  ];

  useEffect(() => {
    if (group && open) {
      setName(group.name || "");

      // 🔥 lessonDays parse
      if (group.lessonDays) {
        const parsedDays = group.lessonDays
          .split(", ")
          .map((day: string) => {
            const found = DAYS.find((d) => d.label.toUpperCase() === day);
            return found?.id;
          })
          .filter(Boolean) as number[];

        setLessonDays(parsedDays);
      }

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

      setStartDate(group.startDate?.split("T")[0] || "");
      setEndDate(group.endDate?.split("T")[0] || "");

      setErrors({});
    }
  }, [group, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Nom kiriting!";
    if (!startDate) newErrors.startDate = "Sana kiriting!";
    if (!endDate) newErrors.endDate = "Sana kiriting!";
    if (!lessonDays.length) newErrors.lessonDays = "Kun tanlang!";
    if (!lessonTime) newErrors.lessonTime = "Vaqt kiriting!";
    if (!monthlyPrice) newErrors.monthlyPrice = "Summa kiriting!";
    if (!maxStudents) newErrors.maxStudents = "Sig'im kiriting!";
    if (!room) newErrors.room = "Xona kiriting!";
    if (!teacher_id) newErrors.teacher_id = "Teacher tanlang!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const numericPrice = Number(monthlyPrice.replace(/\D/g, ""));

      const formattedDays = lessonDays
        .map((d) => DAYS.find((day) => day.id === d)?.label?.toUpperCase())
        .join(", ");

      await apiClient.patch(`${api}/groups/${group.id}`, {
        name,
        startDate,
        endDate,
        lessonDays: formattedDays,
        lessonTime,
        monthlyPrice: numericPrice,
        maxStudents: Number(maxStudents),
        room,
        description,
        teacher_id: Number(teacher_id),
        learning_center_id: Number(localStorage.getItem("id")),
      });

      toast.success("Guruh yangilandi!");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <div className="flex flex-col gap-1">
                <Label>Guruh Nomi</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Boshlanish sanasi</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>Tugash sanasi</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* 🔥 DAYS */}
              <div className="flex flex-col gap-1">
                <Label>O'qish kunlari</Label>
                <Input
                  readOnly
                  value={
                    lessonDays.length
                      ? lessonDays
                          .map((d) => DAYS.find((day) => day.id === d)?.label)
                          .join(", ")
                      : ""
                  }
                  onClick={() => setDaysModal(true)}
                />
                {errors.lessonDays && (
                  <p className="text-red-500 text-xs">{errors.lessonDays}</p>
                )}
              </div>

              {/* TIME */}
              <div className="flex flex-col gap-1">
                <Label>Boshlanish vaqti</Label>
                <Input
                  value={lessonTime}
                  inputMode="numeric"
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length > 4) v = v.slice(0, 4);
                    if (v.length >= 3) v = v.slice(0, 2) + ":" + v.slice(2);
                    setLessonTime(v);
                  }}
                />
              </div>

              {/* PRICE */}
              <div className="flex flex-col gap-1">
                <Label>Oylik summa (uzs)</Label>
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
              </div>

              {/* MAX */}
              <div className="flex flex-col gap-1">
                <Label>Sig'im</Label>
                <Input
                  value={maxStudents}
                  inputMode="numeric"
                  onChange={(e) =>
                    setMaxStudents(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>Xona</Label>
                <Input value={room} onChange={(e) => setRoom(e.target.value)} />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <Label>Qo'shimcha</Label>
                <Input
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <Label>O'qituvchi</Label>
                <GroupTeacherSelect
                  value={teacher_id}
                  onChange={(v) => setTeacherId(v)}
                />
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saqlanmoqda..." : "Yangilash"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 🔥 DAYS MODAL */}
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
