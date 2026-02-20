import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/api/ApiClient";

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
  userData: UserType | null;
  setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
  fetchData: () => Promise<void>;
};
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const api = import.meta.env.VITE_API_URL;
    try {
      setLoading(true);
      const res = await apiClient.get(
        `${api}/auth/me/${localStorage.getItem("id")}`,
      );
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
