import BasicTableOne from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const StudentsPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl !font-bold">O'quvchilar</h1>
        <Button className="bg-blue-500 hover:bg-blue-500/80 cursor-pointer">
          <UserPlus /> Qo'shish
        </Button>
      </div>
      <div className="bg-white dark:bg-fullbg rounded-lg p-5 flex flex-col gap-7">
        <BasicTableOne />
      </div>
    </div>
  );
};

export default StudentsPage;
