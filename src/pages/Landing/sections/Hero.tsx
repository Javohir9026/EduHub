import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="">
      <div className="container md:px-1 flex flex-col md:flex-row items-center justify-center gap-25 md:gap-50">
        <div className="w-[400px] mt-25">
          <h1 className="!font-bold text-3xl md:text-5xl">
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
              className="cursor-pointer !font-semibold hover:text-white hover:bg-purple-500 w-20 md:w-auto"
            >
              Kirish
            </Button>
          </div>
        </div>
        <div className="w-[600px] h-[300px] bg-purple-100 rounded-2xl">
          <div className="flex gap-5 flex-col mx-auto ml-10 mt-10">
            <p className="w-80 h-4 bg-purple-300 rounded-xs"></p>
            <p className="w-133 h-4 bg-purple-300 rounded-xs"></p>
            <p className="w-100 h-4 bg-purple-300 rounded-xs"></p>
          </div>
          <div className="flex gap-5 mx-auto ml-10 mt-10">
            <div className="w-[250px] h-[80px] bg-white rounded-2xl flex flex-col justify-center items-start pl-5">
              <h1 className="!font-bold text-blue-500 text-2xl">200<span className="text-blue-500">+</span></h1>
              <p className="text-[10px]">Maktablar</p>
            </div>
            <div className="w-[250px] h-[80px] bg-white rounded-2xl flex flex-col justify-center items-start pl-5">
              <h1 className="!font-bold text-blue-500 text-2xl">100<span className="text-blue-500 text-1xl !font-bold">k</span></h1>
              <p className="text-[10px]">O'quvchilar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
