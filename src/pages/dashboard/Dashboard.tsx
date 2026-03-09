import TeacherDashboard from "./TeacherDashboard";
import CenterDashboard from "./CenterDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  return role === "teacher" ? <TeacherDashboard /> : <CenterDashboard />;
};

export default Dashboard;
