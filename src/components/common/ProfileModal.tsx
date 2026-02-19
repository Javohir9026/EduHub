import apiClient from "@/api/ApiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import LogOutButton from "./LogOutButton";

export function ProfileModal() {
  const [ProfilePhoto, setProfilePhoto] = useState();
  const [ProfileName, setProfileName] = useState();
  const [PhoneNumber, setPhoneNumber] = useState();
  const [loading, setLoading] = useState(false);
  const getUserData = async () => {
    const api = import.meta.env.VITE_API_URL;
    try {
      setLoading(true);
      const res = await apiClient.get(
        `${api}/auth/me/${localStorage.getItem("id")}`,
      );
      setProfilePhoto(res.data.data.image);
      setProfileName(res.data.data.name);
      setPhoneNumber(res.data.data.phone);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="border-2 border-black/20 dark:border-white/20 cursor-pointer"
      >
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={ProfilePhoto} alt="shadcn" />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {loading ? (
          <div className="flex flex-col min-w-[180px] gap-2 px-3 py-2 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />

              <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="flex gap-1 w-full justify-around">
              <div className="w-full h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />

              <div className="w-full h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="w-full h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : (
          <div className="flex flex-col min-w-[180px] gap-2 px-3 py-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={ProfilePhoto} alt="shadcn" />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium">{ProfileName}</p>
                <p className="text-xs text-gray-500">{PhoneNumber}</p>
              </div>
            </div>
            <div className="flex gap-1 w-full justify-around">
              <div className="cursor-pointer   w-full flex justify-center items-center border rounded-lg hover:bg-gray-100  dark:hover:bg-gray-800 p-1">
                <Link
                  to="/user-profile"
                  className="cursor-pointer p-1 w-full items-center flex justify-center "
                >
                  <Info size={20} />
                </Link>
              </div>
              <div className="cursor-pointer w-full flex justify-center items-center border rounded-lg hover:bg-gray-100  dark:hover:bg-gray-800">
                <AnimatedThemeToggler className=" w-full items-center cursor-pointer flex justify-center" />
              </div>
            </div>
            <LogOutButton />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
