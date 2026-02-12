import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="">
      <div className="container md:px-1 flex flex-col md:flex-row">
        <div className="w-[400px] mt-25">
          <h1 className="!font-bold text-5xl">
            Ta'lim markazini oson boshqarish
          </h1>
          <br />
          <p>
            Ta'lim markazlari uchun to'liq boshqaruv tizimi. O'qituvchilar,
            talabalar, ish haqi hisob-kitoblari, to'lovlar, guruhlar va
            davomatni bir joyda boshqaring.
          </p>{" "}
          <br />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-blue-500 text-white !font-semibold hover:bg-blue-500/85 hover:text-white cursor-pointer"
            >
              Ro'yxatdan o'tish
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer !font-semibold hover:text-white hover:bg-purple-500"
            >
              Kirish
            </Button>
          </div>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
