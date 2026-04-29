import { EduLogoLight } from "@/assets/exportImg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-100/80 text-[13px] text-slate-700">
      <div className="container py-10 sm:py-12">
        <div className="grid gap-8 border-b border-slate-200 pb-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Link
              to="/"
              className="flex h-[54px] w-[180px] cursor-pointer items-center overflow-hidden"
            >
              <img
                src={EduLogoLight}
                alt="EduHub"
                width={150}
                className="object-contain"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500">
              Ta'lim markazlari uchun soddalashtirilgan boshqaruv tizimi.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Platforma
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <Link to="/info-users" className="cursor-pointer hover:text-slate-950">
                Foydalanuvchilar
              </Link>
              <Link to="/about-us" className="cursor-pointer hover:text-slate-950">
                Biz haqimizda
              </Link>
              <Link to="/contact-us" className="cursor-pointer hover:text-slate-950">
                Aloqa
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Modullar
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <a href="#features" className="cursor-pointer hover:text-slate-950">
                O'qituvchilar
              </a>
              <a href="#features" className="cursor-pointer hover:text-slate-950">
                O'quvchilar
              </a>
              <a href="#features" className="cursor-pointer hover:text-slate-950">
                Guruhlar
              </a>
              <a href="#features" className="cursor-pointer hover:text-slate-950">
                To'lovlar
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Boshlash
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <Link to="/register" className="cursor-pointer hover:text-slate-950">
                Ro'yxatdan o'tish
              </Link>
              <Link to="/sign-in" className="cursor-pointer hover:text-slate-950">
                Kirish
              </Link>
              <Link to="/contact-us" className="cursor-pointer hover:text-slate-950">
                Yordam markazi
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025-{new Date().getFullYear()} EduHub. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="cursor-pointer hover:text-slate-950">
              Telegram
            </a>
            <a href="#" className="cursor-pointer hover:text-slate-950">
              Instagram
            </a>
            <a href="#" className="cursor-pointer hover:text-slate-950">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
