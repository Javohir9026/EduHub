import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../sections/Footer";
import { useEffect } from "react";
import { useTheme } from "@/components/common/ThemeProvider";
import { EduLogoLight, EduHubLogo } from "@/assets/exportImg";

const PublicLayout = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, []);

  return (
    <>
      <div className="py-3 top-0 sticky z-50 bg-white shadow-lg">
        <div className="container w-full flex justify-between items-center">
          <div
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center h-[50px]"
            onClick={() => navigate("/")}
          >
            {/* Desktop logo */}
            <img
              src={EduLogoLight}
              alt="LogoLightText"
              className="hidden sm:block w-[200px] object-contain"
            />

            {/* Mobile logo */}
            <img
              src={EduHubLogo}
              alt="LogoMobile"
              className="block sm:hidden w-[100px] object-contain"
            />
          </div>
        </div>
      </div>

      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
