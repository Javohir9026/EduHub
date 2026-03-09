import { Navigate } from "react-router-dom";

const LearningCenterRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "center") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default LearningCenterRoute;