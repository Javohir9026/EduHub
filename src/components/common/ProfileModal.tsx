import apiClient from "@/api/ApiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheckIcon, Loader2, LogOut, Pen, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  const navigate = useNavigate();
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
          <div className="flex items-center justify-center p-3 w-[150px] h-[60px]">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
            <div className="flex flex-col gap-2 px-3 py-2">
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
                  <Link to="/user-profile" className="cursor-pointer p-1">
                    <Pen size={20} />
                  </Link>
                </div>
                <div className="cursor-pointer w-full flex justify-center items-center border rounded-lg hover:bg-gray-100  dark:hover:bg-gray-800">
                  <AnimatedThemeToggler className="p-1 w-full items-center cursor-pointer flex justify-center" />
                </div>
              </div>
              <LogOutButton />
            </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
