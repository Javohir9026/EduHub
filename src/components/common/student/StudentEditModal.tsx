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
import type { Student } from "@/lib/types";
import StudentUpdateGroupSelect from "./StudentGroupSelect";

export function StudentEditModal({
  classname,
  student,
  onSuccess,
}: {
  classname: string;
  student: Student;
  onSuccess?: () => void;
}) {
  const api = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("+998");
  const [parentPhone, setParentPhone] = useState("+998");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student && open) {
      setFullName(student.fullName || "");
      setPhone(student.phone || "+998");
      setParentPhone(student.parentPhone || "+998");
      setAddress(student.address || "");

      const formattedDate = student.birthDate
        ? student.birthDate.split("T")[0]
        : "";
      setBirthDate(formattedDate);

      const firstGroupId = student.groupStudents?.[0]?.group?.id || null;
      setGroupId(firstGroupId);

      setErrors({});
    }
  }, [student, open]);

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (!digits.startsWith("998")) digits = "998";

    digits = digits.slice(0, 12);

    const parts = [
      digits.slice(0, 3),
      digits.slice(3, 5),
      digits.slice(5, 8),
      digits.slice(8, 10),
      digits.slice(10, 12),
    ].filter(Boolean);

    return "+" + parts.join(" ");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Ism familiya majburiy";
    if (!phone || phone.length < 17)
      newErrors.phone = "Telefon to'liq kiritilishi kerak";
    if (!parentPhone || parentPhone.length < 17)
      newErrors.parentPhone = "Ota-ona telefoni majburiy";
    if (!birthDate) newErrors.birthDate = "Tug'ilgan sana majburiy";
    if (!groupId) newErrors.groupId = "Guruh ID majburiy";
    if (!address.trim()) newErrors.address = "Manzil majburiy";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const data: any = {};

      // Diff check: faqat o'zgarganlarni yuborish
      const originalBirthDate = student.birthDate
        ? student.birthDate.split("T")[0]
        : "";
      const originalGroupId = student.groupStudents?.[0]?.group?.id || null;

      if (fullName !== student.fullName) data.fullName = fullName;
      if (phone !== student.phone) data.phone = phone;
      if (parentPhone !== student.parentPhone) data.parentPhone = parentPhone;
      if (birthDate !== originalBirthDate) data.birthDate = birthDate;
      if (groupId !== originalGroupId) data.groupId = Number(groupId);
      if (address !== student.address) data.address = address;

      if (Object.keys(data).length === 0) {
        toast.info("Hech qanday o'zgarish kiritilmadi");
        return;
      }

      await apiClient.patch(`${api}/students/${student.id}`, data);

      toast.success("O'quvchi yangilandi!");
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.data?.message?.includes("phone")) {
        setErrors((prev) => ({
          ...prev,
          phone: "Bu telefon raqam allaqachon mavjud",
        }));
      } else {
        toast.error("Xatolik yuz berdi");
      }
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

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>O'quvchini tahrirlash</AlertDialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
            <div className="flex flex-col gap-1">
              <Label>Ism Familiya</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">{errors.fullName}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Telefon</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Ota-ona telefoni</Label>
              <Input
                value={parentPhone}
                onChange={(e) => setParentPhone(formatPhone(e.target.value))}
              />
              {errors.parentPhone && (
                <span className="text-red-500 text-sm">
                  {errors.parentPhone}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Tug'ilgan sana</Label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              {errors.birthDate && (
                <span className="text-red-500 text-sm">{errors.birthDate}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Guruh</Label>
              <StudentUpdateGroupSelect
                value={groupId ? String(groupId) : ""}
                onChange={(val) => setGroupId(val)}
              />
              {errors.groupId && (
                <span className="text-red-500 text-sm">{errors.groupId}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Manzil</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <span className="text-red-500 text-sm">{errors.address}</span>
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
