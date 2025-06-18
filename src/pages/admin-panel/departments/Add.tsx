import Button from "../../../shared/ui/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { DepartmentsFormFields } from "../../../entities/admin/departments/forms/schema"
import DepartmentsForm from "../../../entities/admin/departments/forms/form"
import { departmentService } from "../../../entities/admin/departments/services/service"

export default function AdminDepartmentsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: DepartmentsFormFields) => {
    await departmentService.create(data)
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
