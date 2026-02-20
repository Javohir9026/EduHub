import apiClient from "@/api/ApiClient";
import { DefaultUserIcon } from "@/assets/exportImg";
import { Button } from "@/components/ui/button";
import { Loader2, Pen } from "lucide-react";
import React, { useEffect, useState } from "react";

interface userType {
  email: string;
  image: string | null;
  is_blocked: boolean;
  login: string;
  name: string;
  password: string;
  phone: string;
  role: string;
}
const userProfile = () => {
  const [userData, setUserData] = useState<userType | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchdata = async () => {
    const api = import.meta.env.VITE_API_URL;
    try {
      setLoading(true);
      const res = await apiClient.get(
        `${api}/auth/me/${localStorage.getItem("id")}`,
      );
      setUserData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-[20px] !font-semibold">Shaxsiy Profil</h1>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-fullbg rounded-lg p-5 flex flex-col gap-7">
          <div
            className="border border-black/10 dark:border-white/10 p-4 rounded-lg 
flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-center text-center sm:text-left">
              <div className="border bg-fullbg dark:bg-fullbg rounded-full w-20 h-20 overflow-hidden shrink-0">
                <img
                  src={userData?.image ?? DefaultUserIcon}
                  alt="logo"
                  className="object-cover w-full h-full"
                />
              </div>

              <div>
                <h1 className="text-[20px] !font-semibold">{userData?.name}</h1>
                <h1 className="text-[14px] text-black/50 dark:text-white/50">
                  {userData?.phone}
                </h1>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <Button
                variant={"outline"}
                className="cursor-pointer w-full sm:w-auto"
              >
                <Pen />
                Tahrirlash
              </Button>
            </div>
          </div>

          <div className="border border-black/10 dark:border-white/10 p-4 rounded-lg flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-[17px] !font-semibold">
                Shaxsiy Ma'lumotlar
              </h1>

              <Button
                variant={"outline"}
                className="cursor-pointer w-full sm:w-auto hidden sm:flex"
              >
                <Pen />
                Tahrirlash
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:w-1/2 gap-4">
              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Nomi
                </h1>
                <h1>{userData?.name}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Email
                </h1>
                <h1>{userData?.email}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Telefon Raqam
                </h1>
                <h1>{userData?.phone}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Login
                </h1>
                <h1>{userData?.login}</h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Role
                </h1>
                <h1>
                  {userData?.role == "LEARNING_CENTER"
                    ? "Ta'lim Markazi"
                    : userData?.role == "TEACHER"
                      ? "Ustoz"
                      : userData?.role}
                </h1>
              </div>

              <div className="flex flex-col">
                <h1 className="text-[15px] text-black/50 dark:text-white/50">
                  Status
                </h1>
                <h1
                  className={
                    userData?.is_blocked ? "text-red-500" : "text-green-500"
                  }
                >
                  {userData?.is_blocked ? "Bloklangan" : "Aktiv"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default userProfile;
