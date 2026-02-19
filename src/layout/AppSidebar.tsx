import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { EduLogoDark, EduLogoLight, EduHubLogo } from "@/assets/exportImg";
import { Calendar, Home, Layers, Users, UsersRound } from "lucide-react";
import LogOutButton from "@/components/common/LogOutButton";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const navLinks = [
    {
      id: 1,
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      id: 2,
      title: "O'quvchilar",
      path: "/students",
      icon: Users,
    },
    {
      id: 3,
      title: "O'qituvchilar",
      path: "/teachers",
      icon: UsersRound,
    },
    {
      id: 4,
      title: "Guruhlar",
      path: "/groups",
      icon: Layers,
    },
    {
      id: 5,
      title: "Kalendar",
      path: "/calendar",
      icon: Calendar,
    },
  ];

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0
      bg-background text-gray-900 h-screen
      transition-all duration-300 ease-in-out
      z-50 border-r-2 border-border
      ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
      }
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="py-8 -mt-5 flex w-full justify-center">
        <Link to="/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="h-[100px] w-[200px] flex items-center justify-center overflow-hidden">
              {/* Light */}
              <img
                src={EduLogoLight}
                alt="Logo"
                width={180}
                height={60}
                className="object-contain block dark:hidden"
              />

              {/* Dark */}
              <img
                src={EduLogoDark}
                alt="Logo"
                width={180}
                height={60}
                className="object-contain hidden dark:block"
              />
            </div>
          ) : (
            <div className="h-[80px] w-[80px] flex items-center justify-center">
              <img
                src={EduHubLogo}
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 no-scrollbar">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.id}
              to={link.path}
              className={`flex gap-3 items-center font-semibold p-2 rounded-lg transition
              ${isActive ? "bg-chart-1 text-white" : "hover:bg-muted"}`}
            >
              <link.icon
                size={25}
                className={`${
                  isActive ? "text-white" : "text-[#98A2B3]"
                } transition`}
              />

              {(isExpanded || isHovered || isMobileOpen) && (
                <span
                  className={`${isActive ? "text-white" : "text-primary/80"}`}
                >
                  {link.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default AppSidebar;
