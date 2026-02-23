import apiClient from "@/api/ApiClient";
import { DefaultUserIcon } from "@/assets/exportImg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { Eye, EyeOff, Pen, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type UserType = {
  name: string;
  email: string;
  phone: string;
  login: string;
  image: string;
};

export function UserEditModal({ classname }: { classname: string }) {
  const api = import.meta.env.VITE_API_URL;
  const { userData, setUserData, fetchData } = useUser();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [Username, setUserName] = useState("");
  const [UserEmail, setUserEmail] = useState("");
  const [UserPhone, setUserPhone] = useState("");
  const [UserLogin, setUserLogin] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState<any>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [originalData, setOriginalData] = useState<UserType>({
    name: "",
    email: "",
    phone: "",
    login: "",
    image: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [deleteImage, setDeleteImage] = useState(false);
  // Telefon formatlash
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

  // Validatsiya
  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name") {
      if (value.trim().length === 0) {
        return "Nomni kiritish shart!";
      }
      if (value.length < 3) {
        return "Nom kamida 3 ta harfdan iborat bo'lishi kerak";
      }
    }

    if (name === "email") {
      if (!value.trim()) return "Emailni kiriting!";
      if (!value.includes("@")) return "Email noto'g'ri";
    }

    if (name === "phone") {
      const phoneRegex =
        /^\+998 (90|91|93|94|95|97|98|99|88|33|77|50) \d{3} \d{2} \d{2}$/;

      if (!value.trim()) return "Telefon kiriting!";
      if (!phoneRegex.test(value)) return "Telefon noto'g'ri!";
    }

    if (name === "login") {
      if (value.length < 3) {
        return "Login kamida 3 ta harf";
      }
    }

    if (name === "password") {
      if (!value) return undefined;

      if (value.length < 8 && value.length > 0)
        return "Parol kamida 8 ta belgidan iborat bo'lishi kerak";

      if (!/[A-Z]/.test(value)) return "Kamida 1 ta katta harf bo'lishi kerak";

      if (!/[a-z]/.test(value)) return "Kamida 1 ta kichik harf bo'lishi kerak";

      if (!/[0-9]/.test(value)) return "Kamida 1 ta raqam bo'lishi kerak";

      if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value))
        return "Kamida 1 ta maxsus belgi bo'lishi kerak";
    }

    return undefined;
  };

  const handleChange = (name: string, value: string) => {
    let formatted = value;

    if (name === "phone") {
      formatted = formatPhone(value);
      setUserPhone(formatted);
    }

    if (name === "name") setUserName(value);
    if (name === "email") setUserEmail(value);
    if (name === "login") setUserLogin(value);

    const error = validateField(name, formatted);

    setErrors((prev: any) => ({
      ...prev,
      [name]: error,
    }));
  };

  useEffect(() => {
    if (userData) {
      const data = {
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        login: userData.login || "",
        image: userData.image || "",
      };

      setOriginalData(data);
      setUserName(data.name);
      setUserEmail(data.email);
      setUserPhone(data.phone);
      setUserLogin(data.login);
      setPreview(data.image ? data.image : DefaultUserIcon);
    }
  }, [userData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setDeleteImage(false);
  };
  const handleDeleteImage = () => {
    setImage(null);
    setPreview(DefaultUserIcon);
    setDeleteImage(true);
  };
  const updateData = async (): Promise<boolean> => {
    try {
      setLoading(true);

      const formData = new FormData();
      let hasChanges = false;

      if (Username !== originalData.name) {
        formData.append("name", Username);
        hasChanges = true;
      }

      if (UserEmail !== originalData.email) {
        formData.append("email", UserEmail);
        hasChanges = true;
      }

      if (UserPhone !== originalData.phone) {
        formData.append("phone", UserPhone);
        hasChanges = true;
      }

      if (UserLogin !== originalData.login) {
        formData.append("login", UserLogin);
        hasChanges = true;
      }

      if (password) {
        formData.append("password", password);
        hasChanges = true;
      }

      if (image) {
        formData.append("file", image);
        hasChanges = true;
      }

      if (deleteImage) {
        await apiClient.delete(
          `${api}/learning-centers/${localStorage.getItem("id")}/profile-image`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        hasChanges = true;
      }
      if (!hasChanges) return true;

      await apiClient.patch(
        `${api}/auth/update/${localStorage.getItem("id")}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setUserData((prev: any) => ({
        ...prev,
        name: Username,
        email: UserEmail,
        phone: UserPhone,
        login: UserLogin,
        image: deleteImage ? "" : image,
      }));
      setDeleteImage(false);
      setPassword("");

      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const newErrors = {
      name: validateField("name", Username),
      email: validateField("email", UserEmail),
      phone: validateField("phone", UserPhone),
      login: validateField("login", UserLogin),
      password: password ? validateField("password", password) : undefined,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    if (password !== confirmPassword) {
      setPasswordError("Parollar mos emas");
      return;
    }

    await updateData();
    setOpen(false);
    toast.success("Ma'lumotlar muvaffaqiyatli yangilandi!");
    await fetchData();
    setErrors({});
    setPassword("");
    setPasswordError("");
    setConfirmPassword("");
  };

  const handleCancel = () => {
    setPassword("");
    setPasswordError("");
    setConfirmPassword("");
    setErrors({});
    setUserName(originalData.name);
    setUserEmail(originalData.email);
    setUserPhone(originalData.phone);
    setUserLogin(originalData.login);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className={classname}>
          <Pen size={18} />
          Tahrirlash
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tahrirlash</AlertDialogTitle>
          <AlertDialogDescription>
            Shaxsiy ma'lumotlarni tahrirlash
          </AlertDialogDescription>
          <div className="flex w-full justify-center mt-4">
            <div className="relative group w-28 h-28">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={handleImageChange}
              />

              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
                {preview ? (
                  <img
                    src={preview || DefaultUserIcon}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User size={50} className="text-black/50" />
                  </div>
                )}
              </div>

              {/* Upload overlay */}
              <label
                htmlFor="imageUpload"
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition"
              >
                <Pen className="text-white" size={24} />
              </label>

              {/* Delete button */}
              {preview && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100"
                >
                  <X />
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
            <div className="flex flex-col gap-2">
              <Label>Nomi</Label>
              <Input
                value={Username}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-[12px]">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                value={UserEmail}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-[12px]">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Login</Label>
              <Input
                value={UserLogin}
                onChange={(e) => handleChange("login", e.target.value)}
              />
              {errors.login && (
                <p className="text-red-500 text-[12px]">{errors.login}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Telefon</Label>
              <Input
                value={UserPhone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              {errors.phone && (
                <p className="text-red-500 text-[12px]">{errors.phone}</p>
              )}
            </div>

            <div className="relative flex flex-col gap-2">
              <Label>Yangi Parol</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(
                    validateField("password", e.target.value) || "",
                  );
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {passwordError && (
                <p className="text-red-500 text-[12px]">{passwordError}</p>
              )}
            </div>

            <div className="relative flex flex-col gap-2">
              <Label>Parolni tasdiqlash</Label>
              <Input
                type={showPassword2 ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-8 cursor-pointer"
              >
                {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
