import Button from "../../../components/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { DepartmentsFormFields } from "../../../features/admin/departments/forms/schema"
import DepartmentsForm from "../../../features/admin/departments/forms/form"

export default function AdminDepartmentsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: DepartmentsFormFields) => {
    // await apiPeopleAdd()
    navigate("..")
    return data
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("..")}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <DepartmentsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
