import StudentTableComponent from "@/components/common/tables/StudentTableComponent";
import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

const StudentsPage = () => {
  return (
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "O'quvchilar", href: "/students" },
          ]}
        />
      </div>
      <div className="py-3">
        <StudentTableComponent />
      </div>
    </div>
  );
};

export default StudentsPage;
