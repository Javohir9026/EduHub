import { Link } from "react-router";
import { useSidebar } from "@/context/SidebarContext";
import { EduLogoDark, EduLogoLight, EduHubLogo } from "@/assets/exportImg";
import LogOutButton from "@/components/common/LogOutButton";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

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
      <div
        className={`py-8 -mt-5 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
        }`}
      >
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
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <LogOutButton/>
      </div>
    </aside>
  );
};

export default AppSidebar;
