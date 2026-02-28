import { Button } from "@/components/ui/button";
import { Calendar, ChevronUpSquareIcon, Coins, Plus, Users } from "lucide-react";
import Chart from "react-apexcharts";

export const stats = [
  {id:1, icon:<Users />, title: 'Jami o`quvchilar' , count: '285', persend: "+ O'tgan oyga nisbatan 12%" },
  {id:2, icon:<Coins />, title: 'Oylik daromad' , count: '$25,480', persend: "+ 8,5% ga o'sish" },
  {id:3, icon:<Users />, title: "O'rtacha ishtirok" , count: "92%", persend: "+ O'tgan haftada 2% ga oshgan" },
  {id:4, icon:<ChevronUpSquareIcon />, title: "Faol ustozlar" , count: "42", persend: "+ Bu chorakda 5 ta yangi kurslar" },
];

const Dashboard = () => {

  const AreaChart = () => {
    const options :any ={
      chart: { type: "area", height: 350 },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: { format: "dd/MM/yy HH:mm" }
      }
    };

    const series = [
      { name: "series1", data: [31,40,28,51,42,109,100] },
      { name: "series2", data: [11,32,45,32,34,52,41] }
    ];

    return (
      <div className="bg-white rounded-xl p-4 shadow-md dark:bg-gray-800 mt-8">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    );
  };

  return (
    <div>

      <div className="p-6 flex justify-between items-center md:flex-row flex-col gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2 text-[13px]">
            Qaytib kelganingizdan xursandmiz! Mana sizning ta'lim markazingiz faoliyati
          </p>
        </div>

        <div className="flex gap-4">
          <Button className="flex items-center cursor-pointer gap-2 bg-white border border-black text-black hover:bg-purple-500 hover:text-white hover:border-purple-500 dark:bg-gray-800 dark:text-white">
            <Calendar /> Bu oy
          </Button>

          <Button className="flex items-center cursor-pointer gap-2 bg-gradient-to-r text-white from-[#332a9b] via-[#490bb5] to-[#cc53ed] border-black border-1">
            <Plus /> yangi voqea
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-3 dark:bg-gray-800">
            <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-lg text-blue-600 dark:bg-gray-700 dark:text-white">
              {item.icon}
            </div>

            <p className="text-gray-500 text-sm dark:text-gray-400">{item.title}</p>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold dark:text-white">{item.count}</h2>
              <p className="text-green-500 text-[11px] mt-2">{item.persend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* <AreaChart /> */}

    </div>
  );
};

export default Dashboard;
