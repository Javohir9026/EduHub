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
  content,
  onSuccess,
}: {
  classname: string;
  teacher: Teacher;
  content?: string;
  onSuccess?: () => void;
}) {
  const api = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [salary, setSalary] = useState("");
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
      setLogin(teacher.login || "");
      setSubject(teacher.subject || "");
      setSalary(
        teacher.salary
          ? new Intl.NumberFormat("uz-UZ").format(teacher.salary)
          : "",
      );
      setPassword("");
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

    if (!name.trim()) newErrors.name = "Ism kiriting!";
    if (!lastName.trim()) newErrors.lastName = "Familiya kiriting!";
    if (!phone || phone.length < 17) {
      newErrors.phone = "Telefon noto'g'ri kiritildi!";
    }

    if (!email.trim()) {
      newErrors.email = "Email kiriting!";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Email noto'g'ri kiritildi!";
      }
    }

    if (!login.trim()) newErrors.login = "Login kiriting!";
    if (!subject.trim()) newErrors.subject = "Fanni kiriting!";
    if (!salary.trim()) newErrors.salary = "Maosh kiriting!";

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!strongPasswordRegex.test(password) && password.trim()) {
      newErrors.password = "Parol kuchli bo'lishi kerak! (Masalan: Password1.)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const numericSalary = Number(salary.replace(/\D/g, ""));

      const data: any = {};
      if (email !== teacher.email) {
        data.email = email;
      }
      if (name !== teacher.name) data.name = name;
      if (lastName !== teacher.lastName) data.lastName = lastName;
      if (phone !== teacher.phone) data.phone = phone;
      if (login !== teacher.login) data.login = login;
      if (subject !== teacher.subject) data.subject = subject;
      if (numericSalary !== teacher.salary) data.salary = numericSalary;

      if (password.trim()) {
        data.password = password;
      }

      if (Object.keys(data).length === 0) {
        toast.info("Hech qanday o'zgarish kiritilmadi");
        return;
      }

      await apiClient.patch(`${api}/teachers/${teacher.id}`, data);
      toast.success("O'qituvchi muvaffaqiyatli yangilandi!");
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.data?.message?.includes("phone")) {
        setErrors((prev) => ({
          ...prev,
          phone: "Bu telefon raqam allaqachon mavjud",
        }));
      } else if (error.response?.data?.message?.includes("email")) {
        setErrors((prev) => ({
          ...prev,
          email: "Bu email allaqachon mavjud",
        }));
      } else if (error.response?.data?.message?.includes("login")) {
        setErrors((prev) => ({
          ...prev,
          login: "Bu login allaqachon mavjud",
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
          {content && <span>{content}</span>}
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
                type="text"
                placeholder="3 000 000"
                value={salary}
                onChange={(e) => {
                  const numeric = e.target.value.replace(/\D/g, "");
                  const formatted = numeric
                    ? new Intl.NumberFormat("uz-UZ").format(Number(numeric))
                    : "";
                  setSalary(formatted);
                }}
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
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
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
