import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: Props) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
