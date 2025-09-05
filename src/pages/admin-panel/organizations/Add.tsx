import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import OrganizationsForm from '@/entities/admin-old/organizations/forms/form'
import type { OrganizationsFormFields } from '@/entities/admin-old/organizations/forms/schema'
import { organizationService } from '@/entities/admin-old/organizations/services/service'

export default function AdminOrganizationsAdd() {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: OrganizationsFormFields): Promise<void> => {
      await organizationService.create(data)
      await navigate('..')
    },
    [navigate],
  )

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
