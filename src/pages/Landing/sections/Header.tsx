import { EduLogoLight } from "@/assets/exportImg";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="py-3 top-0 sticky z-99 bg-white shadow-lg">
      <div className="container flex justify-between items-center">
        <div className="w-30 overflow-hidden flex items-center justify-center cursor-pointer" onClick={()=> navigate('/')}>
          <img src={EduLogoLight} alt="LogoLightText" />
        </div>
        <div className="flex items-center gap-5">
          <div className=" hidden md:flex items-center gap-3">
            <a href="#features" className="cursor-pointer hover:border-b-2 hover:border-black text-black/70 hover:text-black">
              Imkoniyatlar
            </a>
            <a href="#benfits" className="cursor-pointer hover:border-b-2 hover:border-black text-black/70 hover:text-black">
              Afzalliklar
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={()=> navigate('/sign-in')} variant="outline" className="cursor-pointer !font-semibold hover:text-white hover:bg-purple-500">Kirish</Button>
            <Button onClick={()=> navigate('/register')} variant="outline" className="bg-blue-500 text-white !font-semibold hover:bg-blue-500/85 hover:text-white cursor-pointer hidden sm:block">Ro'yxatdan o'tish</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
