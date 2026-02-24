import apiClient from "@/api/ApiClient";
import { StudentCreateModal } from "@/components/common/student/StudentCreateModal";
import BasicTableOne from "@/components/common/tables/StudentTableComponent";

const StudentsPage = () => {
  return (
    <div>
      <div className="bg-white dark:bg-fullbg rounded-lg p-5 flex flex-col gap-7">
        <BasicTableOne />
      </div>
    </div>
  );
};

export default StudentsPage;
