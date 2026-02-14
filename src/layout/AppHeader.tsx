import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-background border-b-2 border-border z-50">
      <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6">
        {/* Sidebar Toggle Button */}
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-10 h-10 border-2 border-border rounded-lg"
        >
          ☰
        </button>

        {/* Logo (Mobile only) */}
        <Link to="/" className="lg:hidden">
          <img src="/images/logo/logo.svg" alt="Logo" width={120} />
        </Link>

        {/* Right side  */}
        <div className="hidden lg:flex items-center gap-4">
            {/* content */}
            <AnimatedThemeToggler/>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
