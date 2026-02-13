import { ArrowLeft, Building2, Lock, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/common/FileUploader";
import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("+998");
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

  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name") {
      if (value.trim().length === 0) {
        return "O'quv markazi nomini kiritish shart!";
      }
      if (value.length < 3) {
        return "O'quv markazi nomi kamida 3 ta harfdan iborat bo'lishi kerak";
      }
    }
    if (name === "email") {
      if (value.trim().length === 0) {
        return "Emailni kiritish shart!";
      }
      if (!value.includes("@")) {
        return "Email noto'g'ri";
      }
    }
    if (name === "phone") {
      const phoneRegex = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;

      if (!value.trim()) {
        return "Telefon raqamni kiritish shart!";
      }

      if (!value.startsWith("+998")) {
        return "Raqam +998 bilan boshlanishi shart";
      }

      if (!phoneRegex.test(value)) {
        return "Format: +998 97 123 45 67";
      }
    }

    if (name === "login") {
      if (value.length < 3) {
        return "Login kamida 3 ta harfdan iborat bo'lishi kerak";
      }
    }
    if (name === "password") {
      if (value.length < 6) {
        return "Parol kamida 6 ta harfdan iborat bo'lishi kerak";
      }
    }
    return undefined;
  };
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
          <form className="flex flex-col gap-5">
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
                <Input
                  id="password"
                  type="password"
                  placeholder="Parol"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
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
              </div>
              {errors.password && (
                <p className="text-red-500 text-[12px]">*{errors.password}</p>
              )}
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-500/85 cursor-pointer !font-bold">
              Hisobni Yaratish
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
