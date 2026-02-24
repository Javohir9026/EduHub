import apiClient from "@/api/ApiClient";
import { StudentCreateModal } from "@/components/common/student/StudentCreateModal";
import BasicTableOne from "@/components/common/tables/StudentTableComponent";

const StudentsPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl !font-bold">O'quvchilar</h1>
        <StudentCreateModal classname="flex items-center justify-center gap-2 px-1 rounded-lg text-white border py-2 bg-blue-500 hover:bg-blue-500/80 cursor-pointer" />
      </div>
      <div className="bg-white dark:bg-fullbg rounded-lg p-5 flex flex-col gap-7">
        <BasicTableOne />
      </div>
    </div>
  );
};

export default StudentsPage;
