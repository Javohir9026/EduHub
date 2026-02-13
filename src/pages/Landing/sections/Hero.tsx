import { EduHubHeroImg } from "@/assets/exportImg";
import { Button } from "@/components/ui/button";
import {
  BookMarkedIcon,
  CheckCircle,
  Clock,
  Coins,
  Contact,
  GraduationCap,
  HandshakeIcon,
  ShieldEllipsis,
  Trello,
  TwitchIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="w-ful">
      <div className="container flex flex-col lg:flex-row justify-between items-center mb-15">
        <div className="mt-25 max-w-[500px]">
          <h1 className="!font-bold text-4xl md:text-6xl">
            Ta'lim markazini oson boshqarish
          </h1>
          <br />
          <p>
            Ta'lim markazlari uchun to'liq boshqaruv tizimi. O'qituvchilar,
            talabalar, ish haqi hisob-kitoblari, to'lovlar, guruhlar va
            davomatni bir joyda boshqaring.
          </p>{" "}
          <br />
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              className="
    p-6 w-full md:w-auto
    bg-blue-500 text-white !font-semibold
    hover:bg-blue-500/85 hover:text-white
    cursor-pointer
    relative overflow-hidden
    transition-all duration-300 ease-in-out
    hover:scale-[1.03]
    border-white/30 border-[3px]
    shadow-[0_10px_20px_rgba(0,0,0,0.2)]

    before:content-['']
    before:absolute before:top-0 before:left-[-100px]
    before:w-[100px] before:h-full
    before:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.8),rgba(255,255,255,0)_70%)]
    before:opacity-60
    hover:before:animate-shine
  "
            >
              Ro'yxatdan o'tish
            </Button>

            <Button
              className="
  h-[52px] inline-flex items-center justify-center
  relative z-[1] overflow-hidden
  cursor-pointer
  text-[#090909] text-[18px] leading-none
  px-[1.7em]
  rounded-lg
  bg-[#e8e8e8]
  border border-[#e8e8e8]
  shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
  transition-all duration-200 ease-in

  active:text-[#666]
  active:shadow-[inset_4px_4px_12px_#c5c5c5,inset_-4px_-4px_12px_#ffffff]

  before:content-['']
  before:absolute before:left-1/2 before:top-full
  before:w-[140%] before:h-[180%]
  before:-translate-x-1/2
  before:scale-x-[1.25]
  before:rounded-full
  before:bg-black/5
  before:transition-all before:duration-500 before:delay-100
  before:[transition-timing-function:cubic-bezier(0.55,0,0.1,1)]
  before:-z-[1]

  after:content-['']
  after:absolute after:left-[55%] after:top-[180%]
  after:w-[160%] after:h-[190%]
  after:-translate-x-1/2
  after:scale-x-[1.45]
  after:rounded-full
  after:bg-purple-500
  after:transition-all after:duration-500 after:delay-100
  after:[transition-timing-function:cubic-bezier(0.55,0,0.1,1)]
  after:-z-[1]

  hover:text-white hover:border-purple-500
  hover:before:top-[-35%] hover:before:bg-purple-500 hover:before:scale-y-[1.3] hover:before:scale-x-[0.8]
  hover:after:top-[-45%] hover:after:bg-purple-500 hover:after:scale-y-[1.3] hover:after:scale-x-[0.8]
  "
            >
              Kirish
            </Button>
          </div>
        </div>
        <img
          src={EduHubHeroImg}
          alt="banner"
          className="w-full h-full overflow-auto"
        />
      </div>
      <div id="features" className="w-full h-auto bg-gray-50 mx-auto py-30">
        <div className="container">
          <div className="flex flex-col gap-5">
            <h1 className="flex justify-center text-center !font-bold text-4xl">
              Kuchli xususiyatlar
            </h1>
            <p className="flex justify-center text-center items-center text-gray-500">
              O'quv markazingizni samarali boshqarish uchun kerak bo'lgan hamma
              narsa
            </p>
          </div>
          <br /> <br />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
            <div className="flex flex-col gap-2 bg-white max-w-100 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-600 cursor-pointer">
              <Contact className="text-blue-600 size-10" />
              <h1 className="!font-bold text-1xl">O'qituvchilar boshqaruvi</h1>
              <p className="text-gray-400 text-sm">
                O'qituvchilarni qo'shing, ularning ma'lumotlarini boshqaring,
                oylik maoshlarni hisoblang va to'lovlarni osongina kuzatib
                boring.
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-white max-w-100 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <BookMarkedIcon className="text-blue-600 size-10" />
              <h1 className="!font-bold text-1xl">Talabalar boshqaruvi</h1>
              <p className="text-gray-400 text-sm">
                Talabalarni ro'yxatdan o'tkazing, ularning profillarini
                boshqaring, to'lov sanalarini kuzatib boring va ro'yxatga olish
                holatini kuzatib boring.
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-white max-w-100 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <GraduationCap className="text-blue-600 size-10" />
              <h1 className="!font-bold text-1xl">Guruhlar boshqaruvi</h1>
              <p className="text-gray-400 text-sm">
                Guruhlarni yaratish va tartibga solish, o‘qituvchilarni
                tayinlash, jadvallarni belgilash va guruh ma’lumotlarini
                boshqarish.
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-white max-w-100 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CheckCircle className="text-blue-600 size-10" />
              <h1 className="!font-bold text-1xl">Davomatni kuzatish</h1>
              <p className="text-gray-400 text-sm">
                O'qituvchilar davomatni qayd etishlari, talabalar ishtirokini
                kuzatishlari va davomat hisobotlarini yaratishlari mumkin.
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-white max-w-100 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <Coins className="text-blue-600 size-10" />
              <h1 className="!font-bold text-1xl">Maosh boshqaruvi</h1>
              <p className="text-gray-400 text-sm">
                Avtomatlashtirilgan ish haqi hisob-kitoblari, to'lovlar tarixi
                va barcha o'qituvchilar uchun moliyaviy hisobotlar.
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-white max-w-100 p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <ShieldEllipsis className="text-blue-600 size-10" />
              <h1 className="!font-bold text-1xl">Xavfsiz va ishonchli</h1>
              <p className="text-gray-400 text-sm">
                Sizning xotirjamligingiz uchun shifrlangan ma'lumotlar va
                muntazam zaxira nusxalari bilan korporativ darajadagi
                xavfsizlik.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div id="benfits" className="container py-30">
        <div className="flex flex-col gap-5 mb-20">
          <h1 className="flex justify-center text-center !font-bold text-4xl">
            Nima uchun EduHubni tanlaysiz?
          </h1>
          <p className="flex justify-center text-center items-center text-gray-500">
            Operatsiyalarni soddalashtiring va asosiy e'tiborni eng muhim
            narsaga - ta'limga qarating
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center gap-5">
            <Clock className="text-blue-600 size-10" />
            <div className="flex flex-col w-[500px]">
              <h1 className="!font-bold text-1xl">Vaqtni tejash</h1>
              <p className="text-gray-400 text-sm">
                Ma'muriy vazifalarni avtomatlashtiring va qog'ozbozlik o'rniga
                o'qitish va talabalar muvaffaqiyatiga e'tibor qarating.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <TwitchIcon className="text-blue-600 size-10" />
            <div className="flex flex-col w-[500px]">
              <h1 className="!font-bold text-1xl">Yaxshiroq tashkilot</h1>
              <p className="text-gray-400 text-sm">
                Foydalanish uchun qulay interfeyslar bilan markazingizning
                barcha malumotlarini bir joyda saqlang.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Trello className="text-blue-600 size-10" />
            <div className="flex flex-col w-[500px]">
              <h1 className="!font-bold text-1xl">Moliyaviy aniqlik</h1>
              <p className="text-gray-400 text-sm">
                Barmoqlaringiz uchida ish haqi hisob-kitoblari, to'lovlarni
                kuzatish va moliyaviy hisobotlarni aniqlang.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <HandshakeIcon className="text-blue-600 size-10" />
            <div className="flex flex-col w-[500px]">
              <h1 className="!font-bold text-1xl">Oson hamkorlik</h1>
              <p className="text-gray-400 text-sm">
                O'qituvchilar va administratorlar real vaqt rejimida
                yangilanishlar orqali birgalikda samarali ishlay oladilar.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50">
        <div className="container py-25 flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="flex justify-center !font-bold text-center text-4xl items-center">
              Markazingizni o'zgartirishga tayyormisiz?
            </h1>
            <p className="flex justify-center text-center items-center text-gray-500">
              EduHub-dan foydalanayotgan yuzlab o'quv markazlariga qo'shiling va
              ularning faoliyatini soddalashtiring
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 flex-col md:flex-row">
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              className="
    p-6 w-full md:w-auto
    bg-blue-500 text-white !font-semibold
    hover:bg-blue-500/85 hover:text-white
    cursor-pointer
    relative overflow-hidden
    transition-all duration-300 ease-in-out
    hover:scale-[1.03]
    border-white/30 border-[3px]
    shadow-[0_10px_20px_rgba(0,0,0,0.2)]

    before:content-['']
    before:absolute before:top-0 before:left-[-100px]
    before:w-[100px] before:h-full
    before:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.8),rgba(255,255,255,0)_70%)]
    before:opacity-60
    hover:before:animate-shine
  "
            >
              Ro'yxatdan o'tish
            </Button>

            <Button
              className="
  h-[52px] inline-flex items-center justify-center
  relative z-[1] overflow-hidden
  cursor-pointer
  text-[#090909] text-[18px] leading-none
  px-[1.7em]
  rounded-lg
  bg-[#e8e8e8]
  border border-[#e8e8e8]
  shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
  transition-all duration-200 ease-in

  active:text-[#666]
  active:shadow-[inset_4px_4px_12px_#c5c5c5,inset_-4px_-4px_12px_#ffffff]

  before:content-['']
  before:absolute before:left-1/2 before:top-full
  before:w-[140%] before:h-[180%]
  before:-translate-x-1/2
  before:scale-x-[1.25]
  before:rounded-full
  before:transition-all before:duration-500 before:delay-100
  before:[transition-timing-function:cubic-bezier(0.55,0,0.1,1)]
  before:-z-[1]

  after:content-['']
  after:absolute after:left-[55%] after:top-[180%]
  after:w-[160%] after:h-[190%]
  after:-translate-x-1/2
  after:scale-x-[1.45]
  after:rounded-full
  after:bg-purple-500
  after:transition-all after:duration-500 after:delay-100
  after:[transition-timing-function:cubic-bezier(0.55,0,0.1,1)]
  after:-z-[1]

  hover:text-white hover:border-purple-500
  hover:before:top-[-35%] hover:before:bg-purple-500 hover:before:scale-y-[1.3] hover:before:scale-x-[0.8]
  hover:after:top-[-45%] hover:after:bg-purple-500 hover:after:scale-y-[1.3] hover:after:scale-x-[0.8]
  "
            >
              Kirish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
