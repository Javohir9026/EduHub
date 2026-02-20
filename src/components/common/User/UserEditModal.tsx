import apiClient from "@/api/ApiClient";
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
import { Eye, EyeOff, Pen } from "lucide-react";
import { useEffect, useState } from "react";

type UserType = {
  name: string;
  email: string;
  phone: string;
  login: string;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [originalData, setOriginalData] = useState<UserType>({
    name: "",
    email: "",
    phone: "",
    login: "",
  });

  useEffect(() => {
    if (userData) {
      const data = {
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        login: userData.login || "",
      };

      setOriginalData(data);
      setUserName(data.name);
      setUserEmail(data.email);
      setUserPhone(data.phone);
      setUserLogin(data.login);
    }
  }, [userData]);

  const updateData = async (): Promise<boolean> => {
    try {
      if (!userData) return false;

      setLoading(true);

      const formData = new FormData();
      let hasChanges = false;

      const currentName = Username.trim();
      const currentEmail = UserEmail.trim();
      const currentPhone = UserPhone.trim();
      const currentLogin = UserLogin.trim();

      const originalName = userData.name?.trim() || "";
      const originalEmail = userData.email?.trim() || "";
      const originalPhone = userData.phone?.trim() || "";
      const originalLogin = userData.login?.trim() || "";

      if (currentName !== originalName) {
        formData.append("name", currentName);
        hasChanges = true;
      }

      if (currentEmail !== originalEmail) {
        formData.append("email", currentEmail);
        hasChanges = true;
      }

      if (currentPhone !== originalPhone) {
        formData.append("phone", currentPhone);
        hasChanges = true;
      }

      if (currentLogin !== originalLogin) {
        formData.append("login", currentLogin);
        hasChanges = true;
      }

      if (password.trim() !== "") {
        formData.append("password", password);
        hasChanges = true;
      }

      if (!hasChanges) {
        return true;
      }

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
        name: currentName,
        email: currentEmail,
        phone: currentPhone,
        login: currentLogin,
      }));

      setPassword("");

      return true;
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    setUserName(originalData.name);
    setUserEmail(originalData.email);
    setUserPhone(originalData.phone);
    setUserLogin(originalData.login);
  };

  const handleSave = async () => {
    await updateData();

    setOpen(false);

    await fetchData();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className={classname}>
          <Pen size={18} />
          Tahrirlash
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="!font-semibold text-[18px]">
            Tahrirlash
          </AlertDialogTitle>

          <AlertDialogDescription>
            Shaxsiy ma'lumotlarni tahrirlash.
          </AlertDialogDescription>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 mb-5 w-full">
            <div className="flex flex-col gap-2">
              <Label>Nomi:</Label>
              <Input
                value={Username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email:</Label>
              <Input
                value={UserEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Login:</Label>
              <Input
                value={UserLogin}
                onChange={(e) => setUserLogin(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Telefon:</Label>
              <Input
                value={UserPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label>Yangi Parol</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label>Parolni tasdiqlash</Label>
              <Input
                type={showPassword2 ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-10 -translate-y-1/2"
              >
                {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={loading}
            className="cursor-pointer  bg-red-500 text-white hover:bg-red-600"
          >
            Bekor qilish
          </AlertDialogCancel>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="cursor-pointer bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 px-4 py-2 rounded-md"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Saqlanmoqda...
              </>
            ) : (
              "Saqlash"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
