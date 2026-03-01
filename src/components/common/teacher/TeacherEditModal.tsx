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
import { Eye, EyeOff, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Teacher } from "@/lib/types";

export function TeacherEditModal({
  classname,
  teacher,
  onSuccess,
}: {
  classname: string;
  teacher: Teacher;
  onSuccess?: () => void;
}) {
  const api = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [salary, setSalary] = useState(0);
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [subject, setSubject] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (teacher && open) {
      setEmail(teacher.email || "");
      setName(teacher.name || "");
      setLastName(teacher.lastName || "");
      setPhone(teacher.phone || "+998");
      setSalary(teacher.salary || 0);
      setLogin(teacher.login || "");
      setSubject(teacher.subject || "");
      setErrors({});
    }
  }, [teacher, open]);

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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Ism kiriting!";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Familiya kiriting!";
    }

    if (!phone || phone.length < 17) {
      newErrors.phone = "Telefon to'liq kiritilishi kerak";
    }

    if (!email.trim()) {
      newErrors.email = "Email kiriting!";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Email noto‘g‘ri kiritildi!";
      }
    }

    if (!login.trim()) {
      newErrors.login = "Login kiriting!";
    }

    if (!subject.trim()) {
      newErrors.subject = "Fanni kiriting!";
    }

    if (!salary || salary <= 0) {
      newErrors.salary = "Maosh kiriting!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const data: any = {
        email,
        name,
        lastName,
        phone,
        salary,
        login,
        subject,
        learningCenterId: localStorage.getItem("id"),
      };

      if (password.trim()) {
        data.password = password;
      }

      await apiClient.patch(`${api}/teachers/${teacher.id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("O'qituvchi muvaffaqiyatli yangilandi!");
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
          <AlertDialogTitle>O'qituvchini tahrirlash</AlertDialogTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
            <div className="flex flex-col gap-1">
              <Label>Ism</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Familiya</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">{errors.lastName}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
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
              <Label>Login</Label>
              <Input value={login} onChange={(e) => setLogin(e.target.value)} />
              {errors.login && (
                <span className="text-red-500 text-sm">{errors.login}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Fan</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {errors.subject && (
                <span className="text-red-500 text-sm">{errors.subject}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Maosh</Label>
              <Input
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
              {errors.salary && (
                <span className="text-red-500 text-sm">{errors.salary}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Yangi Parol (ixtiyoriy)</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            {loading ? "Saqlanmoqda..." : "Yangilash"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
