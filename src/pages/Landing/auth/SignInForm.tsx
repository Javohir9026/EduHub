import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { EduHubSignInImg } from "@/assets/exportImg";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import apiClient from "@/api/ApiClient";

interface LoginErrors {
  login?: string;
  password?: string;
}

const SignInForm = () => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateField = (
    name: "login" | "password",
    value: string,
  ): string | undefined => {
    if (name === "login") {
      if (!value.trim()) return "Login kiriting!";
      if (value.length < 6)
        return "Kamida 6 ta belgidan iborat bo'lishi kerak!";
    }
    if (name === "password") {
      if (!value.trim()) return "Parol kiriting!";
      if (value.length < 8)
        return "Kamida 8 ta belgidan iborat bo'lishi kerak!";
    }
    return undefined;
  };

  const isFormValid =
    !validateField("login", login) && !validateField("password", password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL;
      const res = await apiClient.post(`${api}/auth/login`, {
        login,
        password,
      });

      const access_token = res.data?.data?.access_token;
      const refresh_token = res.data?.data?.refresh_token;

      if (access_token) localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("id", res.data.data.user.id);
      toast.success("Kirish muvaffaqiyatli yakunlandi!");
      navigate("/dashboard");
      setLogin("");
      setPassword("");
    } catch (error: any) {
      toast.error("Login yoki parol noto‘g‘ri!", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex-1 p-8 sm:p-10 flex flex-col gap-6">
          <Link to="/">
            <p className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft strokeWidth={1} size={20} />
              Orqaga qaytish
            </p>
          </Link>

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">Xush Kelibsiz</h1>
            <p className="text-gray-500 text-sm">EduHub hisobingizga kiring</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                type="text"
                placeholder="Login"
                value={login}
                onChange={(e) => {
                  const value = e.target.value;
                  setLogin(value);
                  setErrors((prev) => ({
                    ...prev,
                    login: validateField("login", value),
                  }));
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.login && (
                <p className="text-red-500 text-xs mt-1">*{errors.login}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 relative">
              <Label htmlFor="pass">Parol</Label>

              <Input
                id="pass"
                type={showPassword ? "text" : "password"}
                placeholder="Parol"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setErrors((prev) => ({
                    ...prev,
                    password: validateField("password", value),
                  }));
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">*{errors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="checkbox" className="border-gray-300" />
              <Label htmlFor="checkbox" className="text-sm text-gray-600">
                Tizimda qolish
              </Label>
            </div>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full font-bold flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Kirish"
              )}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Hisobingiz yo'qmi?{" "}

              <Link to="/register" className="text-blue-500 hover:underline">

              <Link
                to="/register"
                className="text-blue-500 hover:underline"
              >
                Yaratish
              </Link>
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Yordam kerakmi?{" "}
            <Link to="/contact-us" className="text-blue-500 hover:underline">
              Biz bilan bog'laning
            </Link>
          </p>
        </div>


        <div className="hidden md:flex flex-1 bg-blue-500 items-center justify-center">

          <img src={EduHubSignInImg} alt="SignInImg" className="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
