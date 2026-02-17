import { useState } from "react";
import { Button } from "../ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

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
import apiClient from "@/api/ApiClient";

const LogOutButton = ({
  isExpanded,
  isHovered,
  isMobileOpen,
}: {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}) => {
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await apiClient.post(
        `${api}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg cursor-pointer flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Chiqilmoqda...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              {(isExpanded || isHovered || isMobileOpen) && (
                <span>Chiqish</span>
              )}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Chiqish</AlertDialogTitle>
          <AlertDialogDescription>
            Buyruqni tasdiqlashga ishonchingiz komilmi?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Yo'q, Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg cursor-pointer flex items-center gap-2"
            onClick={handleLogout}
          >
            Ha, Chiqish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogOutButton;
