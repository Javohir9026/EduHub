import StudentTableComponent from "@/components/common/tables/StudentTableComponent";

const StudentsPage = () => {
  return (
    <div>
      <div className="bg-white dark:bg-fullbg rounded-lg p-5 flex flex-col gap-7">
        <StudentTableComponent />
      </div>
    </div>
  );
};

export default StudentsPage;
