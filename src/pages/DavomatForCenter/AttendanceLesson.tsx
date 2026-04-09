import { BreadcrumbBasic } from "@/components/common/BreadCrumb";
import { useParams } from "react-router-dom";

const AttendanceLesson = () => {
  const { id } = useParams();
  return (
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Davomat", href: "/attendances-center" },
            { title: "Dars Davomati", href: `/attendance-lesson/${id}` },
          ]}
        />
      </div>
      Davomat page with lesson id: {id}
    </div>
  );
};

export default AttendanceLesson;
