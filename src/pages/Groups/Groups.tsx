import { BreadcrumbBasic } from "@/components/common/BreadCrumb"
import GroupTableComponent from "@/components/common/tables/GroupTableComponents"

const Groups = () => {
  return (
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "Guruhlar", href: "/groups" },
          ]}
        />
      </div>
      <div className="py-3"><GroupTableComponent /></div>
    </div>
  )
}

export default Groups