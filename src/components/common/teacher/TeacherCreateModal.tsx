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

export function TeacherCreateModal({
  classname,
  onSuccess,
}: {
  classname: string;
  onSuccess: () => void;
}) {
  const api = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [salary, setSalary] = useState<Number>(0);
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [subject, setSubject] = useState("");
  const learningCenterId = localStorage.getItem("id");
  const [errors, setErrors] = useState<any>({});

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
    if (name === "name") {
      if (!value.trim()) return "Ismni kiriting!";
      if (value.trim().length < 3) return "Kamida 3 ta harf bo'lishi kerak!";
    }
    if (name === "lastName") {
      if (!value.trim()) return "Familiyani kiriting!";
      if (value.trim().length < 3) return "Kamida 3 ta harf bo'lishi kerak!";
    }
    if (name === "email") {
      if (!value.trim()) return "Emailni kiriting!";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        return "Email noto'g'ri kiritildi!";
      }
    }

    if (name === "phone") {
      const phoneRegex =
        /^\+998 (90|91|93|94|95|97|98|99|88|33|77|50) \d{3} \d{2} \d{2}$/;

      if (!value.trim()) return "Telefon kiriting!";
      if (!phoneRegex.test(value)) return "Telefon noto'g'ri!";
    }

    if (name === "salary") {
      if (!value) return "Maoshni kiriting!";
    }

    if (name === "password") {
      if (!value.trim()) return "Parolni kiriting!";
    }

    if (name === "login") {
      if (!value.trim()) return "Loginni kiriting!";
    }

    if (name === "subject") {
      if (!value.trim()) return "Fanni kiriting";
    }
    return undefined;
  };

  // realtime change
  const handleChange = (name: string, value: string) => {
    let formatted = value;

    if (name === "phone") {
      formatted = formatPhone(value);
      setPhone(formatted);
    } else if (name === "name") {
      setName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "salary") {
      setSalary(Number(value));
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "login") {
      setLogin(value);
    } else if (name === "subject") {
      setSubject(value);
    }

    const error = validateField(name, formatted);

    setErrors((prev: any) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleCancel = () => {
    setOpen(false);
    setEmail("");
    setName("");
    setLastName("");
    setPhone("+998");
    setSubject("");
    setLogin("");
    setPassword("");
    setSalary(0);
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = {
      email: validateField("email", email),
      name: validateField("name", name),
      lastName: validateField("lastName", lastName),
      phone: validateField("phone", phone),
      salary: validateField("salary", String(salary)),
      password: validateField("password", password),
      login: validateField("login", login),
      subject: validateField("subject", subject),
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    try {
      setLoading(true);

      const res = await apiClient.post(`${api}/teachers`, {
        email,
        name,
        lastName,
        phone,
        salary,
        password,
        login,
        subject,
        learningCenterId: learningCenterId,
      });
      console.log(res);
      toast.success("O'qituvchi qo'shildi!");
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
          <AlertDialogTitle>O'qituvchi qo'shish</AlertDialogTitle>

          <div className="grid grid-cols-1 w-full sm:grid-cols-2 gap-3 mt-4">
            <div className="flex flex-col gap-2">
              <Label>Ism</Label>
              <Input
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Familiya</Label>
              <Input
                value={lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
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
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Oylik Maosh</Label>
              <Input
                value={String(salary)}
                onChange={(e) => handleChange("salary", e.target.value)}
              />
              {errors.salary && (
                <p className="text-red-500 text-xs">{errors.salary}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Fan</Label>
              <Input
                value={subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs">{errors.subject}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Login</Label>
              <Input
                value={login}
                onChange={(e) => handleChange("login", e.target.value)}
              />
              {errors.login && (
                <p className="text-red-500 text-xs">{errors.login}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Parol</Label>
              <Input
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
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
