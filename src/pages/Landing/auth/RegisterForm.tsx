import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/common/FileUploader";
import { useState } from "react";
import { toast } from "sonner";
import apiClient from "@/api/ApiClient";

interface RegisterErrors {
  name?: string;
  email?: string;
  phone?: string;
  login?: string;
  password?: string;
}

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "+998 ",
  login: "",
  password: "",
};

const RegisterForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // BUG FIX: consistent naming — was "isloading" (non-standard), now "isLoading"
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    // BUG FIX: revoke previous object URL to prevent memory leak
    if (preview) URL.revokeObjectURL(preview);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const formatPhone = (value: string): string => {
    let digits = value.replace(/\D/g, "");
    if (!digits.startsWith("998")) {
      digits = "998" + digits.replace(/^998/, "");
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

  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name") {
      if (!value.trim()) return "O'quv markazi nomini kiritish shart!";
      if (value.length < 3) return "Kamida 3 ta harfdan iborat bo'lishi kerak";
    }
    if (name === "email") {
      if (!value.trim()) return "Emailni kiritish shart!";
      // BUG FIX: use proper regex instead of includes("@gmail.com")
      // Previous check accepted "notanemail@gmail.com.evil.com" as valid
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email noto'g'ri formatda";
    }
    if (name === "phone") {
      const phoneRegex =
        /^\+998 (90|91|93|94|95|97|98|99|88|33|77|50) \d{3} \d{2} \d{2}$/;
      if (!value.trim() || value === "+998 ") return "Telefon raqamni kiritish shart!";
      if (!value.startsWith("+998")) return "Raqam +998 bilan boshlanishi shart";
      if (!phoneRegex.test(value)) return "Operator kodi noto'g'ri kiritildi!";
    }
    if (name === "login") {
      if (value.length < 3) return "Login kamida 3 ta harfdan iborat bo'lishi kerak";
    }
    if (name === "password") {
      if (value.length < 8) return "Parol kamida 8 ta belgidan iborat bo'lishi kerak";
      if (!/[A-Z]/.test(value)) return "Parolda kamida 1 ta katta harf bo'lishi kerak";
      if (!/[a-z]/.test(value)) return "Parolda kamida 1 ta kichik harf bo'lishi kerak";
      if (!/[0-9]/.test(value)) return "Parolda kamida 1 ta raqam bo'lishi kerak";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
        return "Parolda kamida 1 ta maxsus belgi bo'lishi kerak";
    }
    return undefined;
  };

  const isFormInvalid = Object.keys(formData).some((key) =>
    validateField(key, formData[key as keyof typeof formData]),
  );

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormInvalid) return;

    try {
      const api = import.meta.env.VITE_API_URL;
      setIsLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("login", formData.login);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      if (file) data.append("file", file);

      await apiClient.post(`${api}/auth/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!");
      // BUG FIX: reset state BEFORE navigate to avoid updates on unmounted component
      setFormData(INITIAL_FORM);
      setFile(null);
      setPreview(null);
      navigate("/sign-in");
    } catch (error: unknown) {
      // BUG FIX: "any" → "unknown" with safe type narrowing
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? "Xatolik yuz berdi!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input wrapper class
  const inputWrapCls =
    "border border-black/20 rounded-lg w-full flex items-center px-2 " +
    "focus-within:outline focus-within:outline-2 focus-within:outline-blue-400";

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 py-10 px-4">
      <div className="flex flex-col gap-7 w-full max-w-md">
        <Link to="/">
          <p className="flex gap-1 text-[14px] items-center text-black/70 hover:text-black w-fit">
            <ArrowLeft strokeWidth={1} size={20} />
            Orqaga qaytish
          </p>
        </Link>

        <div className="border rounded-3xl border-black/10 p-7 flex flex-col gap-5 bg-white shadow-sm">
          <div>
            <h1 className="font-bold dark:text-black text-2xl">Xush Kelibsiz</h1>
            <p className="text-black/60 text-[14px] mt-1 leading-relaxed">
              Ta'lim markazi hisobingizni yarating va{" "}
              <br className="hidden sm:block" />
              bugundan boshqarishni boshlang
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* File upload */}
            <div className="flex items-center justify-center">
              <FileUploader value={preview} onChange={handleFileChange} />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="dark:text-black">
                O'quv Markaz Nomi
              </Label>
              <div className={inputWrapCls}>
                <Building2 size={16} className="stroke-black/50 flex-shrink-0" />
                <Input
                  id="name"
                  type="text"
                  placeholder="O'quv Markaz"
                  className="border-none dark:text-black focus:outline-none focus:ring-0 focus-visible:ring-0"
                  autoComplete="off"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs">*{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="dark:text-black">Email</Label>
              <div className={inputWrapCls}>
                <Mail size={16} className="stroke-black/50 flex-shrink-0" />
                <Input
                  id="email"
                  type="email"
                  placeholder="misol@gmail.com"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                  autoComplete="off"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">*{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="dark:text-black">Telefon Raqam</Label>
              <div className={inputWrapCls}>
                <Phone size={16} className="stroke-black/50 flex-shrink-0" />
                <Input
                  id="phone"
                  type="text"
                  inputMode="numeric"
                  placeholder="+998 90 123 45 67"
                  className="border-none dark:text-black focus:outline-none focus:ring-0 focus-visible:ring-0"
                  autoComplete="off"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    handleChange("phone", formatted);
                  }}
                  onKeyDown={(e) => {
                    // BUG FIX: was checking <= 4, but formatted "+998 " is 5 chars
                    if (formData.phone.length <= 5 && e.key === "Backspace") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs">*{errors.phone}</p>
              )}
            </div>

            {/* Login */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login" className="dark:text-black">Login</Label>
              <div className={inputWrapCls}>
                <User size={16} className="stroke-black/50 flex-shrink-0" />
                <Input
                  id="login"
                  type="text"
                  placeholder="Login"
                  className="border-none dark:text-black focus:outline-none focus:ring-0 focus-visible:ring-0"
                  autoComplete="off"
                  value={formData.login}
                  onChange={(e) => handleChange("login", e.target.value)}
                />
              </div>
              {errors.login && (
                <p className="text-red-500 text-xs">*{errors.login}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="dark:text-black">Parol</Label>
              <div className={inputWrapCls}>
                <Lock size={16} className="stroke-black/50 flex-shrink-0" />
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Parol"
                    autoComplete="off"
                    className="border-none dark:text-black focus:outline-none focus:ring-0 focus-visible:ring-0 pr-8"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">*{errors.password}</p>
              )}
            </div>

            <Button
              disabled={isFormInvalid || isLoading}
              className={`w-full font-bold dark:text-white flex items-center justify-center gap-2 rounded-lg transition-all ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Hisobni Yaratish"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-black/10" />
            <span className="text-xs text-black/40">yoki</span>
            <hr className="flex-1 border-black/10" />
          </div>

          <p className="text-[14px] text-center dark:text-black">
            Hisobingiz mavjudmi?{" "}
            <Link to="/sign-in" className="text-blue-500 hover:text-blue-600 font-semibold">
              Kirish
            </Link>
          </p>
        </div>

        <div className="flex justify-center">
          <p className="text-[14px] font-light dark:text-black">
            Yordam kerakmi?{" "}
            <Link to="/contact-us" className="text-blue-500 hover:text-blue-600">
              Biz bilan bog'laning
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;