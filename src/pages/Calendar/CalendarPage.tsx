import { BreadcrumbBasic } from "@/components/common/BreadCrumb";
import CalendarBody from "@/components/common/Calendar/components/CalendarBody";

const CalendarPage = () => {
  return (
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Kalendar", href: "/calendar" },
          ]}
        />
      </div>
      <div className="mt-5">
        <CalendarBody />
      </div>
    </div>
  );
};

export default CalendarPage;
