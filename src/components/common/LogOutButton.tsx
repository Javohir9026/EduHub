import { useState } from "react";
import { Button } from "../ui/button";
import { LogOut, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

const LogOutButton = ({isExpanded, isHovered, isMobileOpen}: {isExpanded: boolean, isHovered: boolean, isMobileOpen: boolean}) => {
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await axios.post(
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
    <Button
      disabled={loading}
      onClick={handleLogout}
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
          {(isExpanded || isHovered || isMobileOpen) && <span>Chiqish</span>}
        </>
      )}
    </Button>
  );
};

export default LogOutButton;
