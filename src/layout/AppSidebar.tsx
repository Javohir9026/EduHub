import { Link } from "react-router";
import { useSidebar } from "@/context/SidebarContext";
import { EduLogoDark, EduLogoLight, EduHubLogo } from "@/assets/exportImg";
import LogOutButton from "@/components/common/LogOutButton";
import { Calendar, Home, Layers, User, Users, UsersRound } from "lucide-react";
import { useState } from "react";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const [activeTab, setActivetab] = useState(1);
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
        bg-background 
        text-gray-900 
        h-screen 
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
            <>
              {/* Light mode logo */}
              <div className="h-[100px] w-[200px] flex items-center justify-center overflow-hidden">
                <img
                  src={EduLogoLight}
                  alt="Logo"
                  width={180}
                  height={60}
                  className="object-contain block dark:hidden"
                />

                {/* Dark mode logo */}
                <img
                  src={EduLogoDark}
                  alt="Logo"
                  width={180}
                  height={60}
                  className="object-contain hidden dark:block"
                />
              </div>
            </>
          ) : (
            <>
              {/* Light icon */}
              <div className="h-[80px] w-[80px] flex items-center justify-center">
                <img
                  src={EduHubLogo}
                  alt="Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </>
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 no-scrollbar">
        {navLinks.map((link) => (
          <Link
            onClick={() => setActivetab(link.id)}
            key={link.id}
            to={link.path}
            className={`flex gap-2 !font-semibold p-2 rounded-lg group ${activeTab === link.id ? "bg-chart-1 " : ""}`}
          >
            <link.icon
              className={`text-[#98A2B3] text-primary/80  ${activeTab === link.id ? "text-white " : ""}`}
              size={25}
            />

            {(isExpanded || isHovered || isMobileOpen) && (
              <span
                className={`text-primary/80 font-medium ${activeTab === link.id ? "text-white " : ""} `}
              >
                {link.title}
              </span>
            )}
          </Link>
        ))}
        <LogOutButton
          isExpanded={isExpanded}
          isHovered={isHovered}
          isMobileOpen={isMobileOpen}
        />
      </div>
    </aside>
  );
};

export default AppSidebar;