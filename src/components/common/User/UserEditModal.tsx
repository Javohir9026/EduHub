import apiClient from "@/api/ApiClient";
import {
  AlertDialog,
  AlertDialogAction,
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
import { useState } from "react";

export function UserEditModal({ classname }: { classname: string }) {
  const { userData, loading } = useUser();
  const [Username, setUserName] = useState(userData?.name);
  const [UserEmail, setUserEmail] = useState(userData?.email);
  const [UserPhone, setUserPhone] = useState(userData?.phone);
  const [UserLogin, setUserLogin] = useState(userData?.login);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const updateData = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setPassword("");
  };
  const handleSave = async () => {
    try {
      console.log(
        `data: ${UserEmail} ${Username} ${UserLogin} ${password} ${UserEmail}`,
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline" className={classname}>
          <Pen />
          Tahrirlash
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="!font-semibold text-[18px]">
            Tahrirlash
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-5 mb-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nomi:</Label>
                <Input
                  value={Username}
                  onChange={(e) => setUserName(e.target.value)}
                  id="name"
                  className="!focus:outline-none text-black dark:text-white !min-w-[220px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Email</Label>
                <Input
                  value={UserEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  id="name"
                  className="!focus:outline-none text-black dark:text-white !min-w-[220px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Login</Label>
                <Input
                  value={UserLogin}
                  onChange={(e) => setUserLogin(e.target.value)}
                  id="name"
                  className="!focus:outline-none text-black dark:text-white !min-w-[220px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Telefon Raqami:</Label>
                <Input
                  value={UserPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  id="name"
                  className="!focus:outline-none text-black dark:text-white !min-w-[220px]"
                />
              </div>
              <div className="flex flex-col gap-2 relative">
                <Label htmlFor="pass">Yangi Parol</Label>

                <Input
                  id="pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                  }}
                  className="!focus:outline-none text-black dark:text-white !min-w-[220px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-10 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex flex-col gap-2 relative">
                <Label htmlFor="pass">Yangi Parol</Label>

                <Input
                  id="pass"
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Parol"
                  className="!focus:outline-none text-black dark:text-white !min-w-[220px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2((prev) => !prev)}
                  className="absolute right-3 top-10 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => handleCancel()}
            className="cursor-pointer !dark:bg-red-500/70 !bg-red-500 text-white hover:!bg-red-500/80 hover:text-white"
          >
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleSave()}
            className="cursor-pointer !dark:bg-green-500/70 !bg-green-500 text-white hover:!bg-green-500/80 hover:text-white"
          >
            Saqlash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
