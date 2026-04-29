import { EduHubHeroImg } from "@/assets/exportImg";
import { Button } from "@/components/ui/button";
import {
  BookMarkedIcon,
  CheckCircle2,
  Clock3,
  Coins,
  Contact,
  GraduationCap,
  Handshake,
  ShieldCheck,
  Trello,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const featureCards = [
  {
    icon: Contact,
    title: "O'qituvchilar boshqaruvi",
    text: "Ustozlar ma'lumotlari, ish haqi, faoliyat holati va yuklamani bitta panelda boshqaring.",
  },
  {
    icon: BookMarkedIcon,
    title: "O'quvchilar nazorati",
    text: "Ro'yxatdan o'tish, guruhga biriktirish, to'lov va davomati bo'yicha jarayonlar tartibli ishlaydi.",
  },
  {
    icon: GraduationCap,
    title: "Guruhlar boshqaruvi",
    text: "Guruh, xona, vaqt va ustozni bog'lab, kurslar oqimini chalkashsiz yuriting.",
  },
  {
    icon: CheckCircle2,
    title: "Davomat tizimi",
    text: "Davomatni tez kiritish, ko'rish va analiz qilish uchun markazlashgan qulay oqim.",
  },
  {
    icon: Coins,
    title: "Moliyaviy tartib",
    text: "To'lovlar, qarzdorlik va tushum ko'rsatkichlari real vaqtga yaqin ko'rinishda chiqadi.",
  },
  {
    icon: ShieldCheck,
    title: "Ishonchli boshqaruv",
    text: "Barcha asosiy jarayonlar yagona joyda bo'lgani uchun nazorat va aniqlik oshadi.",
  },
];

const benefits = [
  {
    icon: Clock3,
    title: "Vaqtni tejaydi",
    text: "Ma'muriy ishlarga ketadigan vaqtni kamaytirib, asosiy e'tiborni ta'lim sifatiga qaytaradi.",
  },
  {
    icon: Trello,
    title: "Jarayonni tartiblaydi",
    text: "Talaba, guruh, dars va to'lov ma'lumotlari bir-biriga bog'langan holda ishlaydi.",
  },
  {
    icon: Coins,
    title: "Moliyani aniq ko'rsatadi",
    text: "Tushum, chegirma va qarzdorlikni kuzatish osonlashadi, qaror qabul qilish tezlashadi.",
  },
  {
    icon: Handshake,
    title: "Jamoaviy ishlashni yengillashtiradi",
    text: "Rahbariyat va ustozlar uchun yagona tizim bo'lgani sababli hamkorlik aniqroq bo'ladi.",
  },
];

const quickStats = [
  { value: "Bitta panel", label: "asosiy boshqaruv uchun" },
  { value: "Real vaqt", label: "jarayon monitoringi uchun" },
  { value: "Kamroq chalkashlik", label: "kunlik operatsiyada" },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_38%,#f8fafc_100%)] text-slate-950">
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_35%),radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_28%)]" />
        <div className="container relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                EduHub for Learning Centers
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
                Ta'lim markazini
                <span className="block text-blue-600">tartibli va chiroyli</span>
                boshqaring
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Ustozlar, o'quvchilar, guruhlar, davomat va to'lovlarni yagona
                tizimda boshqaring. EduHub markaz ichidagi kundalik ishlarni
                soddalashtiradi va jarayonni aniq ko'rsatadi.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("/register")}
                  className="cursor-pointer rounded-full bg-blue-600 px-6 py-6 text-base font-semibold text-white hover:bg-blue-500"
                >
                  Bepul boshlash
                </Button>
                <Button
                  onClick={() => navigate("/sign-in")}
                  variant="outline"
                  className="cursor-pointer rounded-full border-slate-300 px-6 py-6 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                >
                  Tizimga kirish
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {quickStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-lg font-black text-slate-950">{item.value}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-36 w-36 rounded-full bg-blue-100 blur-3xl lg:block" />
              <div className="absolute -right-8 bottom-8 hidden h-44 w-44 rounded-full bg-slate-200 blur-3xl lg:block" />

              <div className="relative rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.35)] sm:p-6">
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Central View
                    </p>
                    <p className="mt-1 text-lg font-semibold">Boshqaruv paneli</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                    Soddalashtirilgan oqim
                  </div>
                </div>

                <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50">
                  <img
                    src={EduHubHeroImg}
                    alt="EduHub dashboard preview"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Kundalik nazorat
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Darslar, to'lovlar va guruh oqimi bitta ekranda ko'rinadi.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
                      Minimal rang, aniq fokus
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Ko'rinish toza, o'qish oson va harakatlar bir xil uslubda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-18 sm:py-22">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Imkoniyatlar
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Markaz uchun kerak bo'lgan asosiy modullar
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-500 sm:text-lg">
              Jarayonlar ortiqcha rang va vizual shovqinsiz, lekin aniq
              ajratilgan bloklarda ko'rsatiladi.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="benefits" className="border-y border-slate-200 bg-slate-50/80 py-18 sm:py-22">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                Afzalliklar
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Operatsiyani yengillashtiradigan tizim
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
                EduHub markaz ichidagi jarayonlarni birlashtirib, kunlik ishni
                tezroq va nazoratli qiladi. Foydalanish soddaligi markaz
                rahbariyatiga ham, jamoaga ham foyda beradi.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="py-18 sm:py-22">
        <div className="container">
          <div className="rounded-[36px] border border-slate-200 bg-slate-950 px-6 py-10 text-white shadow-[0_40px_120px_-40px_rgba(15,23,42,0.55)] sm:px-10 sm:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Boshlash
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Markazingizni yanada tartibli boshqarishga o'ting
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
                EduHub bilan ustozlar, guruhlar, to'lovlar va davomatni bitta
                tartibli oqimga yig'ing.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("/register")}
                  className="cursor-pointer rounded-full bg-blue-600 px-6 py-6 text-base font-semibold text-white hover:bg-blue-500"
                >
                  Ro'yxatdan o'tish
                </Button>
                <Button
                  onClick={() => navigate("/sign-in")}
                  variant="outline"
                  className="cursor-pointer rounded-full border-slate-700 bg-transparent px-6 py-6 text-base font-semibold text-white hover:bg-white/10"
                >
                  Kirish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
