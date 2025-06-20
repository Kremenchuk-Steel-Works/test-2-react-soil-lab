import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrganizationsForm from '@/entities/admin/organizations/forms/form'
import type { OrganizationsFormFields } from '@/entities/admin/organizations/forms/schema'
import { organizationService } from '@/entities/admin/organizations/services/service'
import Button from '@/shared/ui/button/Button'

export default function AdminOrganizationsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: OrganizationsFormFields) => {
    await organizationService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
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
