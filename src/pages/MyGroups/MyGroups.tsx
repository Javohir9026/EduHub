import { BreadcrumbBasic } from "@/components/common/BreadCrumb";

const MyGroups = () => {
  return (
    <div>
      <div className="flex justify-end ">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Guruhlarim", href: "/my-groups" },
          ]}
        />
      </div>
      MyGroups
    </div>
  );
};

export default MyGroups;
