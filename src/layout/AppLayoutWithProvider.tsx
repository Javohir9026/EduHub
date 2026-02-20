import { UserProvider } from "@/context/UserContext";
import AppLayout from "./AppLayout";

const AppLayoutWithProvider = () => (
  <UserProvider>
    <AppLayout />
  </UserProvider>
);

export default AppLayoutWithProvider;
