import Button from "../../../components/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { OrganizationsFormFields } from "../../../features/admin/organizations/forms/schema"
import OrganizationsForm from "../../../features/admin/organizations/forms/form"
import { organizationService } from "../../../features/admin/organizations/services/service"

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
