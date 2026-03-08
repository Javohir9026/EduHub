import { BreadcrumbBasic } from "@/components/common/BreadCrumb"
import TeacherTableComponent from "@/components/common/tables/TeacherTableComponent"

const TeachersPage = () => {
  return (
    <div>
      <div className="flex justify-end">
        <BreadcrumbBasic
          items={[
            { title: "Bosh sahifa", href: "/" },
            { title: "O'qituvchilar", href: "/teachers" },
          ]}
        />
      </div>
      <div className="py-3"><TeacherTableComponent /></div>
    </div>
  )
}

export default TeachersPage