import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/api/ApiClient";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  data: {
    group: string;
    groupId: number;
    teacher: string;
    teacherId: number;
    lessonDate: string;
    startTime: string;
  };
  onSuccess: (lessonId: number) => void;
};

const LessonCreateModal = ({ open, setOpen, data, onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    endTime: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.name) newErrors.name = "Mavzu kiritish shart";
    if (!form.description) newErrors.description = "Tavsif kiritish shart";
    if (!form.endTime) newErrors.endTime = "Tugash vaqtini kiriting";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name,
      description: form.description,
      groupId: data.groupId,
      teacherId: data.teacherId,
      lessonDate: data.lessonDate,
      startTime: data.startTime,
      endTime: form.endTime,
    };

    console.log("SEND:", payload);
    const api = import.meta.env.VITE_API_URL;
    const res = await apiClient.post(`${api}/lessons`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    console.log("RES:", res);
    toast.success("Dars muvaffaqiyatli yaratildi");
    onSuccess(res.data.id);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-full max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Yangi dars yaratish</AlertDialogTitle>
        </AlertDialogHeader>

        {/* 🔥 INFO BLOCK */}
        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Guruh:</span>
            <span className="font-medium">{data.group}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">O‘qituvchi:</span>
            <span className="font-medium">{data.teacher}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sana:</span>
            <span className="font-medium">{data.lessonDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Boshlanish:</span>
            <span className="font-medium">{data.startTime.slice(0, 5)}</span>
          </div>
        </div>

        {/* 🔥 FORM */}
        <div className="grid gap-4 py-4">
          {/* Mavzu */}
          <div className="flex flex-col gap-2">
            <Label>Mavzu</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masalan: Algebra asoslari"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Tavsif */}
          <div className="flex flex-col gap-2">
            <Label>Tavsif</Label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Qisqacha tavsif"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* End time */}
          <div className="flex flex-col gap-2">
            <Label>Tugash vaqti</Label>
            <Input
              value={form.endTime}
              type="text"
              inputMode="numeric"
              placeholder="12:00"
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");

                if (value.length > 4) {
                  value = value.slice(0, 4);
                }

                if (value.length >= 3) {
                  value = value.slice(0, 2) + ":" + value.slice(2);
                }

                handleChange("endTime", value); // 🔥 MUHIM
              }}
            />
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Bekor qilish
          </Button>

          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white"
          >
            Saqlash
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LessonCreateModal;
