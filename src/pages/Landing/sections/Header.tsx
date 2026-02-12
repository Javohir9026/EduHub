
import { EduHubLightText } from "@/assets/exportImg";
import { Button } from "@/components/ui/button"
const Header = () => {
  return (
    <div className="py-3 border-b border-black/30">
      <div className="container flex justify-between items-center">
        <div className="w-30 overflow-hidden flex items-center justify-center">
          <img src={EduHubLightText} alt="LogoLightText" />
        </div>
        <div className="flex items-center gap-5">
          <div className=" hidden md:flex items-center gap-3">
            <section id="features" className="cursor-pointer hover:border-b-2 hover:border-black text-black/70 hover:text-black">
              Imkoniyatlar
            </section>
            <section id="benfits" className="cursor-pointer hover:border-b-2 hover:border-black text-black/70 hover:text-black">
              Afzalliklar
            </section>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="cursor-pointer !font-semibold hover:text-white hover:bg-purple-500">Kirish</Button>
            <Button variant="outline" className="bg-blue-500 text-white !font-semibold hover:bg-blue-500/85 hover:text-white cursor-pointer hidden sm:block">Ro'yxatdan o'tish</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
