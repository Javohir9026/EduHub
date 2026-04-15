import { BreadcrumbBasic } from "@/components/common/BreadCrumb"
import LessonTableComponent from "@/components/common/tables/LessonTableComponent"

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
      <div className="py-3"><LessonTableComponent /></div>
    </div>
  )
}

export default Lessons