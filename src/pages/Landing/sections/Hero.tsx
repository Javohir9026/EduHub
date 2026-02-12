import { EduHubHeroImg } from "@/assets/exportImg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="w-ful">
      <div className="container flex flex-col lg:flex-row justify-between">
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
              variant="outline"
              className="bg-blue-500 text-white !font-semibold hover:bg-blue-500/85 hover:text-white cursor-pointer w-full md:w-auto"
            >
              Ro'yxatdan o'tish
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer !font-semibold hover:text-white hover:bg-purple-500 w-full md:w-auto"
            >
              Kirish
            </Button>
          </div>
        </div>
        <img src={EduHubHeroImg} alt="banner" className="w-full h-full" />
      </div>
    </div>
  );
};

export default Hero;
