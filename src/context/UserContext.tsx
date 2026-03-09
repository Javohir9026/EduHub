import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";
import type { Teacher } from "@/lib/types";

type UserType = {
  id: string;
  name: string;
  email: string;
  login: string;
  phone: string;
  image: string;
  role: string;
  is_blocked: boolean;
};

type UserContextType = {
  userData: UserType | Teacher | null;
  setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
  fetchData: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const id = localStorage.getItem("id");
      const role = localStorage.getItem("role");

      const endpoint =
        role === "center"
          ? "auth/me"
          : role === "teacher"
            ? "teachers"
            : "";
      if (!id) {
        setUserData(null);
        return;
      }
      if(!role){
        setUserData(null);
        return;
      }

      const api = import.meta.env.VITE_API_URL;
      const res = await apiClient.get(`${api}/${endpoint}/${id}`);
      setUserData(res.data.data);
    } catch (error) {
      console.log(error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading, fetchData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
};
