import { EduHubLightText } from "@/assets/exportImg";
import { Button } from "@/components/ui/button";
import { Users, Globe, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-20 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-5xl lg:text-6xl !font-bold text-blue-800 mb-6">
            Biz haqimizda
          </h1>
          <p className="text-black/70 text-lg lg:text-xl mb-8">
            EduHub ta'lim markazlarini raqamli boshqarish va o‘quv jarayonini
            soddalashtirishga ixtisoslashgan yetakchi platformadir. Bizning
            maqsadimiz – har bir o‘quv markazi va o‘quvchi uchun eng qulay
            va interaktiv muhit yaratish.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg cursor-pointer" onClick={()=>navigate('/contact-us')}>
            Biz bilan bog‘lanish
          </Button>
        </div>
        <div className="flex-1">
          <img
            src={EduHubLightText}
            alt="About Us"
          />
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container mx-auto px-6 lg:px-20 py-20">
        <h2 className="text-4xl !font-semibold text-center text-blue-800 mb-12">
          Bizning asosiy qadriyatlarimiz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <Users className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="font-semibold text-black text-xl mb-2">
              Jamiyat
            </h3>
            <p className="text-black ">
              Biz foydalanuvchilarimiz va hamkorlarimiz bilan doimo ochiq va
              hamkorlik ruhida ishlaymiz.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <Globe className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="font-semibold text-black text-xl mb-2">
              Innovatsiya
            </h3>
            <p className="text-black">
              Raqamli yechimlar va zamonaviy texnologiyalar yordamida
              ta’limni yanada samarali qilamiz.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <Award className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="font-semibold text-black text-xl mb-2">
              Sifat
            </h3>
            <p className="text-black">
              Har bir xizmati va mahsulotimiz yuqori sifat standartlariga
              javob beradi.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      {/* <section className="container mx-auto px-6 lg:px-20 py-20">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          Bizning jamoa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {["Ali", "Maqsud", "Nilufar", "Sardor"].map((name, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-500"
            >
              <img
                src={`https://randomuser.me/api/portraits/lego/${index + 1}.jpg`}
                alt={name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-blue-800 font-semibold text-xl">{name}</h3>
                <p className="text-blue-600">Team Member</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default AboutUsPage;
