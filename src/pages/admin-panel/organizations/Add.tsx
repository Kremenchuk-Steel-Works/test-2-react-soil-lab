import { useNavigate } from 'react-router-dom'
import OrganizationsForm from '@/entities/admin/organizations/forms/form'
import type { OrganizationsFormFields } from '@/entities/admin/organizations/forms/schema'
import { organizationService } from '@/entities/admin/organizations/services/service'

export default function AdminOrganizationsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: OrganizationsFormFields) => {
    await organizationService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <OrganizationsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
