import { EduHubLightText } from "@/assets/exportImg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-blue-100 text-black text-[13px]">
      <div className="container pt-10 pb-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center sm:justify-start">
              <img src={EduHubLightText} alt="EduHubLogoLight" width={150} />
            </div>
            <p className="text-black/70 text-center sm:text-start">
              Ta'lim markazlari uchun to'liq <br />
              boshqaruv tizimi
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="!font-bold text-1xl">Foydalanuvchilar</h1>
            <ul className="flex flex-col">
              <Link to="/info-users" className="text-black/70 hover:text-black w-fit">
                Ustozlar
              </Link>
              <Link to="/info-users" className="text-black/70 hover:text-black w-fit">
                O'quvchilar
              </Link>
              <Link to="/info-users" className="text-black/70 hover:text-black w-fit">
                Guruhlar
              </Link>
              <Link to="/info-users" className="text-black/70 hover:text-black w-fit">
                To'lovlar
              </Link>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="!font-bold text-1xl">Qollab Quvvatlash</h1>
            <ul>
              <li className="text-black/70">Biz bilan bog'lanish</li>
              <li className="text-black/70">Yordam markazi</li>
              <li className="text-black/70">Tavsiyalar</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="!font-bold text-1xl">Tashkilot</h1>
            <ul>
              <li className="text-black/70">Biz haqimizda</li>
              <li className="text-black/70">Maxfiylik</li>
              <li className="text-black/70">Shartlar va qoidalar</li>
            </ul>
          </div>
        </div>
        <div className="items-center text-center justify-between grid sm:grid-cols-2 text-center md:text-start">
          <p className="text-black/70">
            © {new Date().getFullYear()} EduHub. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-2 justify-center md:justify-end">
            <a
              href="#"
              className="text-black/70 hover:border-b-1 hover:border-black"
            >
              Telegram
            </a>
            <a
              href="#"
              className="text-black/70 hover:border-b-1 hover:border-black"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-black/70 hover:border-b-1 hover:border-black"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
