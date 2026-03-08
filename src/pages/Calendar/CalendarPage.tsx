import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

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
      <div className="p-6 space-y-8">
        Calendar Content...
      </div>
    </div>
  );
};

export default CalendarPage;
