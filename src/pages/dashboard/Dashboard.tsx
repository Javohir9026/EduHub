import { Button } from "@/components/ui/button";
import { Calendar, ChevronUpSquareIcon, Coins, Plus, User, Users } from "lucide-react";

export const stats = [
  {id:1, icon:<Users />, title: 'Jami o`quvchilar' , count: '285', persend: "+ O'tgan oyga nisbatan 12%" },
  {id:2, icon:<Coins />, title: 'Oylik daromad' , count: '$25,480', persend: "+ 8,5% ga o'sish" },
  {id:3, icon:<Users />, title: "O'rtacha ishtirok" , count: "92%", persend: "+ O'tgan haftada 2% ga oshgan" },
  {id:4, icon:<ChevronUpSquareIcon />, title: "Faol ustozlar" , count: "42", persend: "+ Bu chorakda 5 ta yangi kurslar" },
];

const Dashboard = () => {
  return (
    <div>
    <div className="p-6 flex justify-between items-center md:flex-row flex-col gap-4">
      <div>
        <h1 className="text-4xl font-black tracking-tight flex justify-center md:justify-start">Dashboard</h1>

        <p className="text-gray-500 mt-2 text-[13px]">
          Qaytib kelganingizdan xursandmiz! Mana sizning ta'lim markazingiz
          faoliyati
        </p>
      </div>
      <div className="flex gap-4">
        <Button className="flex items-center gap-2 bg-white border border-black text-black hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-colors duration-200 cursor-pointer">
          <Calendar />
          Bu oy
        </Button>
        <Button className="flex items-center gap-2 bg-gradient-to-r text-white from-[#332a9b] via-[#490bb5] to-[#cc53ed] cursor-pointer">
          <Plus />
          yangi voqea
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div key={item.id} className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-3">
          <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-lg text-blue-600">
            {item.icon}
          </div>
          <p className="text-gray-500 text-sm">{item.title}</p>
         <div className="flex items-center gap-2">
           <h2 className="text-2xl font-bold">{item.count}</h2>
          <p className="text-green-500 text-[11px] mt-2">{item.persend}</p>
         </div>
        </div>
      ))}
    </div>
    
    </div>
  );
};

export default Dashboard;
