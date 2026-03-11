import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

const AttendancesPage = () => {
  return (
    <div>
      <div className="flex justify-end ">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Davomat", href: "/attendances" },
          ]}
        />
      </div>
      Attendances
    </div>
  );
};

export default AttendancesPage;
