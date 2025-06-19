import Button from "../../../shared/ui/button123/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { OrganizationsFormFields } from "../../../entities/admin/organizations/forms/schema"
import OrganizationsForm from "../../../entities/admin/organizations/forms/form"
import { organizationService } from "../../../entities/admin/organizations/services/service"

export default function AdminOrganizationsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: OrganizationsFormFields) => {
    await organizationService.create(data)
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
          <OrganizationsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
