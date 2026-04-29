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
import RoleSwitcher from "@/components/common/RoleSwitcher";

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
  const [role, setRole] = useState<string>("center");
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
      // BUG FIX: "endpoind" → "endpoint"
      const endpoint = role === "center" ? "auth/login" : "teachers/login";
      const api = import.meta.env.VITE_API_URL;
      const res = await apiClient.post(`${api}/${endpoint}`, {
        login,
        password,
      });
      const access_token = res.data?.data?.access_token;
      const refresh_token = res.data?.data?.refresh_token;

      if (role === "center") {
        localStorage.setItem("role", "center");
        // BUG FIX: added optional chaining to avoid crash if user is undefined
        localStorage.setItem("id", res.data?.data?.user?.id ?? "");
      } else {
        localStorage.setItem("role", "teacher");
        // BUG FIX: added optional chaining to avoid crash if teacher is undefined
        localStorage.setItem("id", res.data?.data?.teacher?.id ?? "");
      }

      if (access_token) localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

      toast.success("Kirish muvaffaqiyatli yakunlandi!");
      // BUG FIX: state cleanup moved BEFORE navigate to avoid state updates on unmounted component
      setLogin("");
      setPassword("");
      navigate("/dashboard");
    } catch (error: unknown) {
      // BUG FIX: changed "any" to "unknown" for better type safety
      toast.error("Login yoki parol noto'g'ri!", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full">
        {/* Left: Form */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col gap-6">
          <Link to="/">
            <p className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-fit">
              <ArrowLeft strokeWidth={1} size={20} />
              Orqaga qaytish
            </p>
          </Link>

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">Xush Kelibsiz</h1>
            <p className="text-gray-500 text-sm">EduHub hisobingizga kiring</p>
          </div>

          <div className="flex flex-col gap-4">
            <RoleSwitcher onChange={(r) => setRole(r)} />

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Login field */}
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
                  className="border border-gray-300 dark:text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.login && (
                  <p className="text-red-500 text-xs mt-1">*{errors.login}</p>
                )}
              </div>

              {/* Password field */}
              {/* BUG FIX: eye button top value corrected from "top-10" to "top-1/2"
                  so it always stays vertically centered regardless of label height */}
              <div className="flex flex-col gap-2 relative">
                <Label htmlFor="pass">Parol</Label>
                <div className="relative">
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
                    className="border dark:text-black border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    *{errors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox id="checkbox" className="border-gray-300" />
                <Label
                  htmlFor="checkbox"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Tizimda qolish
                </Label>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full font-bold flex items-center justify-center gap-2 py-3 rounded-lg transition-all cursor-pointer ${
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

              {/* Register link — only for center role */}
              {role === "center" && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Hisobingiz yo'qmi?{" "}
                  <Link
                    to="/register"
                    className="text-blue-500 hover:underline"
                  >
                    Yaratish
                  </Link>
                </p>
              )}
            </form>
          </div>

          <p className="text-center text-sm text-gray-500">
            Yordam kerakmi?{" "}
            <Link to="/contact-us" className="text-blue-500 hover:underline">
              Biz bilan bog'laning
            </Link>
          </p>
        </div>

        {/* Right: Image panel */}
        <div className="hidden md:flex flex-1 bg-blue-500 items-center justify-center">
          <img
            src={EduHubSignInImg}
            alt="Sign in illustration"
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
