import apiClient from "@/api/ApiClient";
import {
  ChevronUpSquareIcon,
  Coins,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [techersCount,setTechersCount] = useState<number>(0);
  const [totalPaid,setTotalPaid] = useState<number>(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const api = import.meta.env.VITE_API_URL;
        const learningCenterId = localStorage.getItem('id');
        const res = await apiClient.get(
          `${api}/learning-centers/${learningCenterId}/statistics`,
          {
            headers:{Authorization:`Bearer ${token}`}
          }
          
        );
        setTechersCount(res.data.data.teacherCount);
        setTotalPaid(res.data.data.totalPayments)
        setStudentsCount(res.data.data.studentCount);
      } catch (error) {
        
      }
    }
    fetchStatistics();
  }, []);

  const stats = [
    {
      id: 1,
      icon: <Users />,
      title: "Jami o`quvchilar",
      count: studentsCount,
      persend: "+ O'tgan oyga nisbatan 12%",
    },
    {
      id: 2,
      icon: <Coins />,
      title: "Umumiy Daromad",
      count: totalPaid,
      persend: "+ 8,5% ga o'sish",
    },
    {
      id: 3,
      icon: <Users />,
      title: "O'rtacha ishtirok",
      count: "92%",
      persend: "+ O'tgan haftada 2% ga oshgan",
    },
    {
      id: 4,
      icon: <ChevronUpSquareIcon />,
      title: "Faol ustozlar",
      count: techersCount,
      persend: "+ Bu chorakda 5 ta yangi kurslar",
    },
  ];

  return (
    <div>
      <div className="p-6 flex justify-between items-center md:flex-row flex-col gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2 text-[13px]">
            Qaytib kelganingizdan xursandmiz! Mana sizning ta'lim markazingiz
            faoliyati
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-3 dark:bg-gray-800"
          >
            <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-lg text-blue-600 dark:bg-gray-700 dark:text-white">
              {item.icon}
            </div>

            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.title}
            </p>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold dark:text-white">
                {item.count}
              </h2>
              <p className="text-green-500 text-[11px] mt-2">{item.persend}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
