import Button from "../../../shared/ui/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { PermissionsFormFields } from "../../../entities/admin/permissions/forms/schema"
import PermissionsForm from "../../../entities/admin/permissions/forms/form"
import { permissionService } from "../../../entities/admin/permissions/services/service"

export default function AdminPermissionsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PermissionsFormFields) => {
    await permissionService.create(data)
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
          <PermissionsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
