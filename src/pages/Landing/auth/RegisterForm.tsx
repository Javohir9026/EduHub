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
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+998",
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({
    name: "",
    email: "",
    phone: "",
    login: "",
    password: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const handleChange = (selected: File | null) => {
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };
  const formatPhone = (value: string) => {
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
  const [isloading, setisloading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const api = import.meta.env.VITE_API_URL;
      setisloading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("login", formData.login);
      data.append("password", formData.password);
      data.append("phone", formData.phone);

      if (file) {
        data.append("file", file);
      }

      await apiClient.post(`${api}/auth/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!");
      setFormData({
        name: "",
        email: "",
        phone: "+998",
        login: "",
        password: "",
      });
      navigate("/sign-in");
      setFile(null);
      setPreview(null);
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error.response?.data.error.message);
    } finally {
      setisloading(false);
    }
  };

  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name") {
      if (value.trim().length === 0) {
        return "O'quv markazi nomini kiritish shart!";
      }
      if (value.length < 3) {
        return "nomi kamida 3 ta harfdan iborat bo'lishi kerak";
      }
    }
    if (name === "email") {
      if (value.trim().length === 0) {
        return "Emailni kiritish shart!";
      }
      if (!value.includes("@gmail.com")) {
        return "Email noto'g'ri";
      }
    }
    if (name === "phone") {
      const phoneRegex =
        /^\+998 (90|91|93|94|95|97|98|99|88|33|77|50) \d{3} \d{2} \d{2}$/;
      if (!value.trim()) {
        return "Telefon raqamni kiritish shart!";
      }

      if (!value.startsWith("+998")) {
        return "Raqam +998 bilan boshlanishi shart";
      }

      if (!phoneRegex.test(value)) {
        return "Operator kodi notog'ri kiritildi!";
      }
    }

    if (name === "login") {
      if (value.length < 3) {
        return "Login kamida 3 ta harfdan iborat bo'lishi kerak";
      }
    }
    if (name === "password") {
      if (value.length < 8) {
        return "Parol kamida 8 ta belgidan iborat bo'lishi kerak";
      }

      if (!/[A-Z]/.test(value)) {
        return "Parolda kamida 1 ta katta harf bo'lishi kerak";
      }

      if (!/[a-z]/.test(value)) {
        return "Parolda kamida 1 ta kichik harf bo'lishi kerak";
      }

      if (!/[0-9]/.test(value)) {
        return "Parolda kamida 1 ta raqam bo'lishi kerak";
      }

      if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
        return "Parolda kamida 1 ta maxsus belgi bo'lishi kerak";
      }
    }
    return undefined;
  };
  const isFormInvalid = Object.keys(formData).some((key) =>
    validateField(
      key as keyof typeof formData,
      formData[key as keyof typeof formData],
    ),
  );

  return (
    <div className="flex justify-center items-center mt-10 mb-10">
      <div className="flex flex-col gap-7">
        <Link to="/">
          <p className="flex gap-1 text-[14px] items-center text-black/70 hover:text-black">
            <ArrowLeft strokeWidth={1} size={20} />
            Orqaga qaytish
          </p>
        </Link>
        <div className="border rounded-[27px] border-black/20 sm:p-7 p-2 flex flex-col gap-5">
          <div className="flex flex-col">
            <h1 className="!font-bold text-[25px] text-center sm:text-start">
              Xush Kelibsiz
            </h1>
            <p className="text-black/70 text-[14px] text-center sm:text-start">
              Ta'lim markazi hisobingizni yarating va <br /> bugundan
              boshqarishni boshlang
            </p>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex items-center justify-center">
              <FileUploader value={preview} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">O'quv Markaz Nomi</Label>
              <div
                className="
    border border-black/20 rounded-lg sm:w-[400px] w-[350px]
    flex items-center px-2
    focus-within:outline
    focus-within:outline-2
    focus-within:outline-blue-400
  "
              >
                <Building2 className="stroke-black/60" />

                <Input
                  id="name"
                  type="text"
                  placeholder="O'quv Markaz"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                  autoComplete="off"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      name: validateField("name", e.target.value),
                    }));
                  }}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-[12px]">*{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div
                className="
    border border-black/20 rounded-lg sm:w-[400px] w-[350px]
    flex items-center px-2
    focus-within:outline
    focus-within:outline-2
    focus-within:outline-blue-400
  "
              >
                <Mail className="stroke-black/60" />
                <Input
                  autoComplete="off"
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      email: validateField("email", e.target.value),
                    }));
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[12px]">*{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefon Raqam</Label>
              <div
                className="
    border border-black/20 rounded-lg sm:w-[400px] w-[350px]
    flex items-center px-2
    focus-within:outline
    focus-within:outline-2
    focus-within:outline-blue-400
  "
              >
                <Phone className="stroke-black/60" />
                <Input
                  autoComplete="off"
                  id="phone"
                  type="text"
                  value={formData.phone}
                  inputMode="numeric"
                  placeholder="+998 90 123 45 67"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);

                    setFormData((prev) => ({
                      ...prev,
                      phone: formatted,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      phone: validateField("phone", formatted),
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (formData.phone.length <= 4 && e.key === "Backspace") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-[12px]">*{errors.phone}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login">Login</Label>
              <div
                className="
    border border-black/20 rounded-lg sm:w-[400px] w-[350px]
    flex items-center px-2
    focus-within:outline
    focus-within:outline-2
    focus-within:outline-blue-400
  "
              >
                <User className="stroke-black/60" />
                <Input
                  id="login"
                  type="text"
                  autoComplete="off"
                  placeholder="Login"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                  value={formData.login}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      login: e.target.value,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      login: validateField("login", e.target.value),
                    }));
                  }}
                />
              </div>
              {errors.login && (
                <p className="text-red-500 text-[12px]">*{errors.login}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Parol</Label>
              <div
                className="
    border border-black/20 rounded-lg sm:w-[400px] w-[350px]
    flex items-center px-2
    focus-within:outline
    focus-within:outline-2
    focus-within:outline-blue-400
  "
              >
                <Lock className="stroke-black/60" />
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Parol"
                    autoComplete="off"
                    className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0 pr-10"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        password: validateField("password", e.target.value),
                      }));
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[12px]">*{errors.password}</p>
              )}
            </div>
            <Button
              disabled={isFormInvalid || isloading}
              className={`w-full cursor-pointer !font-bold flex items-center justify-center gap-2 ${
                isloading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-500/85"
              }`}
              type="submit"
            >
              {isloading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Hisobni Yaratish"
              )}
            </Button>
          </form>
          <div className="flex gap-2 items-center">
            <p className="border-b-2 border-black/10 w-full"></p>
            <p className="text-[14px] text-black/50">yoki</p>
            <p className="border-b-2 border-black/10 w-full"></p>
          </div>
          <p className="text-[14px] text-center">
            Hisobingiz mavjudmi ?{" "}
            <Link to="/sign-in">
              <span className="text-blue-500 hover:text-blue-500/85 cursor-pointer !font-semibold">
                Kirish
              </span>
            </Link>
          </p>
        </div>
        <div className="flex justify-center">
          <p className="text-[14px] !font-light">
            Yordam kerakmi ?{" "}
            <Link to="#">
              <span className="text-blue-500 hover:text-blue-500/85 cursor-pointer">
                Biz bilan bog'laning
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
