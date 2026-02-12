import { ArrowLeft, Building2, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
const RegisterForm = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col gap-7">
        <Link to="/">
          <p className="flex gap-1 text-[14px] items-center text-black/70 hover:text-black">
            <ArrowLeft strokeWidth={1} size={20} />
            Orqaga qaytish
          </p>
        </Link>
        <div className="border rounded-[27px] border-black/20 p-7 flex flex-col gap-5">
          <div className="flex flex-col">
            <h1 className="!font-bold text-[25px]">Xush Kelibsiz</h1>
            <p className="text-black/70 text-[14px]">
              EduHub hisobingizni yarating va bugundan <br /> boshqarishni boshlang!
            </p>
          </div>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="login">O'quv Markaz Nomi</Label>
              <div
                className="
    border border-black/20 rounded-lg w-[400px]
    flex items-center px-2
    focus-within:outline
    focus-within:outline-2
    focus-within:outline-blue-400
  "
              >
                <Building2 className="stroke-black/60" />

                <Input
                  id="login"
                  type="text"
                  placeholder="O'quv Markaz"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pass">Parol</Label>
              <div
                className="
    border border-black/20 rounded-lg w-[400px]
    flex items-center px-2
    focus-within:outline
    focus-within:outline-2
    focus-within:outline-blue-400
  "
              >
                <Lock className="stroke-black/60" />
                <Input
                  id="pass"
                  type="password"
                  placeholder="Parol"
                  className="border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="flex justify-start gap-2 items-center">
                <Checkbox id="checkbox" className="border-black/20"/>
                <Label htmlFor="checkbox" className="text-[14px]">Tizimda qolish</Label>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-500/85 cursor-pointer !font-bold">Kirish</Button>
          </form>
          <div className="flex gap-2 items-center">
            <p className="border-b-2 border-black/10 w-full"></p>
            <p className="text-[14px] text-black/50">yoki</p>
            <p className="border-b-2 border-black/10 w-full"></p>
          </div>
            <p className="text-[14px] text-center">Hisobingiz yo'qmi ? <Link to="/register"><span className="text-blue-500 hover:text-blue-500/85 cursor-pointer !font-semibold">Ro'yxatdan o'tish</span></Link></p>
        </div>
        <div className="flex justify-center">
            <p className="text-[14px] !font-light">Yordam kerakmi ? <Link to="#"><span className="text-blue-500 hover:text-blue-500/85 cursor-pointer">Biz bilan bog'laning</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
