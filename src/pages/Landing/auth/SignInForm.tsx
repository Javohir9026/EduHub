import { ArrowLeft, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface LoginErrors {
  login?: string;
  password?: string;
}
const SignInForm = () => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const validateField = (
    name: "login" | "password",
    value: string,
  ): string | undefined => {
    if (name === "login" && !value.trim()) {
      return "Login kiriting!";
    }
    if (name === "login" && value.length < 6) {
      return "Kamida 6 ta belgidan iborat bo'lishi kerak!";
    }

    if (name === "password") {
      if (!value.trim()) {
        return "Parol kiriting!";
      }
      if (value.length < 8) {
        return "Kamida 8 ta belgidan iborat bo'lishi kerak!";
      }
    }

    return undefined;
  };
  const [showPassword, setShowPassword] = useState(false);
  const isFormValid =
    !validateField("login", login) && !validateField("password", password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setLoading(true);

      const api = import.meta.env.VITE_API_URL;

      const res = await axios.post(`${api}/auth/login`, {
        login: login,
        password: password,
      });

      console.log("Success:", res.data);
      
      const access_token = res.data?.data?.access_token;
      const refresh_token = res.data?.data?.refresh_token;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
      }
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }
      navigate("/dashboard");
      setLogin("");
      setPassword("");
      toast.success("Kirish muvaffaqiyatli yakunlandi!");
    } catch (error: any) {
      console.log(error);
      toast.error("login Yoki Parol Notog'ri!", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
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
              EduHub hisobingizga kiring
            </p>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                  value={login}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLogin(value);

                    const error = validateField("login", value);

                    setErrors((prev) => ({
                      ...prev,
                      login: error,
                    }));
                  }}
                  id="login"
                  type="text"
                  placeholder="Login"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                />
              </div>
              {errors.login && (
                <p className="text-red-500 text-[12px]">*{errors.login}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pass">Parol</Label>
              <div
                className="relative 
  border border-black/20 rounded-lg sm:w-[400px] w-[350px]
  flex items-center px-2
  focus-within:outline
  focus-within:outline-2
  focus-within:outline-blue-400"
              >
                <Lock className="stroke-black/60" />

                <Input
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);

                    const error = validateField("password", value);

                    setErrors((prev) => ({
                      ...prev,
                      password: error,
                    }));
                  }}
                  id="pass"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0 pr-8"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-black/60"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-[12px]">*{errors.password}</p>
              )}
            </div>
            <div className="flex justify-start gap-2 items-center">
              <Checkbox id="checkbox" className="border-black/20" />
              <Label htmlFor="checkbox" className="text-[14px]">
                Tizimda qolish
              </Label>
            </div>
            <Button
              disabled={!isFormValid || loading}
              className={`w-full !font-bold flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-500/85"
              }`}
              type="submit"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Kirish"
              )}
            </Button>
          </form>
          <div className="flex gap-2 items-center">
            <p className="border-b-2 border-black/10 w-full"></p>
            <p className="text-[14px] text-black/50">yoki</p>
            <p className="border-b-2 border-black/10 w-full"></p>
          </div>
          <p className="text-[14px] text-center">
            Hisobingiz yo'qmi ?{" "}
            <Link to="/register">
              <span className="text-blue-500 hover:text-blue-500/85 cursor-pointer !font-semibold">
                Ro'yxatdan o'tish
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

export default SignInForm;
