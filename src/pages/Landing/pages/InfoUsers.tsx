import { Coins, GraduationCapIcon, SquareUserRound, User, Users } from "lucide-react";

export default function UsersPage() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl !font-semibold mb-6 text-blue-900">
            Platforma foydalanuvchilari
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            EduHub platformasi turli rolga ega foydalanuvchilarni yagona tizim
            orqali boshqarish imkonini beradi. Har bir foydalanuvchi turi uchun
            alohida panel, moslashtirilgan interfeys va maxsus funksiyalar
            mavjud. Bu esa platformadan foydalanishni nafaqat qulay, balki
            samarali ham qiladi. Tizim barcha jarayonlarni avtomatlashtirib,
            inson omili xatolarini kamaytiradi va boshqaruv jarayonini
            soddalashtiradi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            [
              <SquareUserRound className="text-blue-500"/>,
              "Ustozlar",
              "Ustozlar uchun yaratilgan boshqaruv paneli orqali dars jadvali, guruhlar, o‘quvchilar natijalari, davomat statistikasi va baholash tizimi to‘liq nazorat qilinadi. Shuningdek, ustozlar o‘quvchilarga individual izoh va tavsiyalar berishi mumkin.",
            ],
            [
              <Users className="text-blue-500"/>,
              "O‘quvchilar",
              "O‘quvchilar shaxsiy kabinet orqali kurslar jadvali, baholari, davomati, to‘lov holati va ustozlar tomonidan berilgan izohlarni kuzatishi mumkin. Bu o‘quv jarayonini shaffof va nazorat qilinadigan qiladi.",
            ],
            [
              <GraduationCapIcon className="text-blue-500"/>,
              "Guruhlar",
              "Har bir guruh uchun alohida boshqaruv tizimi mavjud bo‘lib, unda jadval, ustoz biriktirish, o‘quvchilar ro‘yxati, davomati va statistika jamlanadi. Bu markaz rahbariyatiga to‘liq nazorat imkonini beradi.",
            ],
            [
              <Coins className="text-blue-500"/>,
              "To‘lovlar",
              "Moliyaviy modul barcha to‘lovlarni avtomatik hisoblab boradi. Qarzdorlik nazorati, hisobotlar, statistikalar va tranzaksiya tarixlari bir joyda saqlanadi va real vaqt rejimida yangilanadi.",
            ],
          ].map(([icon, title, desc]) => (
            <div className="group bg-white p-8 rounded-3xl border shadow-sm hover:shadow-2xl transition">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
                {icon}
              </div>

              <h3 className="text-xl font-semibold mb-4">{title}</h3>

              <p className="text-gray-600 leading-relaxed text-[15px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
