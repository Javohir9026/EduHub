import { BreadcrumbBasic } from "@/components/common/BreadCrumb"
import GroupTableComponent from "@/components/common/tables/GroupTableComponents"

const Lessons = () => {
  return (
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Darslar", href: "/lessons" },
          ]}
        />
      </div>
      <div className="py-3"><GroupTableComponent /></div>
    </div>
  )
}

export default Lessons