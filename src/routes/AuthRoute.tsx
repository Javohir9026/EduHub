import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;