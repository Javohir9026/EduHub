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
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StudentUpdateGroupSelect from "./StudentGroupSelect";

export function StudentCreateModal({
  classname,
  onSuccess,
}: {
  classname: string;
  onSuccess: () => void;
}) {
  const api = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [groupId, setGroupId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("+998");
  const [parentPhone, setParentPhone] = useState("+998");
  const [errors, setErrors] = useState<any>({});

  // Telefon formatlash
  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (!digits.startsWith("998")) {
      digits = "998";
    }

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

  // Validatsiya
  const validateField = (name: string, value: string): string | undefined => {
    if (name === "fullName") {
      if (!value.trim()) return "Ism Familiya kiriting!";
      if (value.trim().length < 3) return "Kamida 3 ta harf bo‘lishi kerak!";
    }

    if (name === "phone" || name === "parentPhone") {
      const phoneRegex =
        /^\+998 (90|91|93|94|95|97|98|99|88|33|77|50) \d{3} \d{2} \d{2}$/;

      if (!value.trim()) return "Telefon kiriting!";
      if (!phoneRegex.test(value)) return "Telefon noto‘g‘ri!";
    }

    if (name === "birthDate") {
      if (!value) return "Tug'ilgan sana kiriting!";

      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return "Sana noto'g'ri!";
      }

      const today = new Date();
      if (date > today) {
        return "Kelajak sana kiritish mumkin emas!";
      }
    }
    if (name === "groupId") {
      if (!value.trim()) return "Guruh kiriting!";
    }

    if (name === "address") {
      if (!value.trim()) return "Manzil kiriting!";
    }

    return undefined;
  };

  // realtime change
  const handleChange = (name: string, value: string) => {
    let formatted = value;

    if (name === "phone") {
      formatted = formatPhone(value);
      setPhone(formatted);
    } else if (name === "parentPhone") {
      formatted = formatPhone(value);
      setParentPhone(formatted);
    } else if (name === "fullName") {
      setFullName(value);
    } else if (name === "birthDate") {
      setBirthDate(value);
    } else if (name === "groupId") {
      setGroupId(value);
    } else if (name === "address") {
      setAddress(value);
    }

    const error = validateField(name, formatted);

    setErrors((prev: any) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleCancel = () => {
    setOpen(false);
    setFullName("");
    setPhone("+998");
    setParentPhone("+998");
    setBirthDate("");
    setGroupId("");
    setAddress("");
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = {
      fullName: validateField("fullName", fullName),
      phone: validateField("phone", phone),
      parentPhone: validateField("parentPhone", parentPhone),
      birthDate: validateField("birthDate", birthDate),
      groupId: validateField("groupId", groupId),
      address: validateField("address", address),
    };

    if (phone === parentPhone) {
      newErrors.parentPhone =
        "Ota-ona va o'quvchi telefoni bir xil bo'lishi mumkin emas!";
    }

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    try {
      setLoading(true);

      await apiClient.post(`${api}/students`, {
        fullName,
        phone,
        parentPhone,
        birthDate,
        learningCenterId: localStorage.getItem("id"),
        groupId: Number(groupId),
        address,
      });

      toast.success("O'quvchi qo'shildi!");
      onSuccess?.();
      handleCancel();
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || "";

      if (message.includes("duplicate")) {
        setErrors((prev: any) => ({
          ...prev,
          phone: "Bu telefon raqam allaqachon mavjud!",
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
        <button className={classname}>
          <UserPlus size={18} />
          <span className="hidden md:inline">Qo'shish</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>O'quvchi qo'shish</AlertDialogTitle>

          <div className="grid grid-cols-1 w-full sm:grid-cols-2 gap-3 mt-4">
            <div className="flex flex-col gap-2">
              <Label>Ism Familiya</Label>
              <Input
                value={fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs">{errors.fullName}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Telefon</Label>
              <Input
                value={phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Ota-ona telefoni</Label>
              <Input
                value={parentPhone}
                onChange={(e) => handleChange("parentPhone", e.target.value)}
              />
              {errors.parentPhone && (
                <p className="text-red-500 text-xs">{errors.parentPhone}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tug'ilgan sana</Label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-xs">{errors.birthDate}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Guruh </Label>
              <StudentUpdateGroupSelect value={groupId} onChange={setGroupId} />
              {errors.groupId && (
                <p className="text-red-500 text-xs">{errors.groupId}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Manzil</Label>
              <Input
                value={address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address}</p>
              )}
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="!bg-red-500 cursor-pointer text-white hover:text-white hover:!bg-red-500/80"
          >
            Bekor qilish
          </AlertDialogCancel>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 cursor-pointer text-white hover:bg-green-500/80"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
