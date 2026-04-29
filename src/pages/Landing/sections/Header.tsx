import { EduLogoLight } from "@/assets/exportImg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex h-12 w-[170px] cursor-pointer items-center justify-start overflow-hidden sm:w-[190px]"
        >
          <img src={EduLogoLight} alt="EduHub" className="object-contain" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#hero"
            className="cursor-pointer text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Bosh sahifa
          </a>
          <a
            href="#features"
            className="cursor-pointer text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Imkoniyatlar
          </a>
          <a
            href="#benefits"
            className="cursor-pointer text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Afzalliklar
          </a>
          <a
            href="#cta"
            className="cursor-pointer text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Boshlash
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => navigate("/sign-in")}
            variant="outline"
            className="cursor-pointer rounded-full border-slate-300 px-4 font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
          >
            Kirish
          </Button>
          <Button
            onClick={() => navigate("/register")}
            className="hidden cursor-pointer rounded-full bg-blue-600 px-5 font-semibold text-white hover:bg-blue-500 sm:inline-flex"
          >
            Ro'yxatdan o'tish
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
