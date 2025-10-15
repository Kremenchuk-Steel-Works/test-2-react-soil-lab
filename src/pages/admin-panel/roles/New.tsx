import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import RolesForm from '@/entities/admin-old/roles/forms/form'
import type { RolesFormFields } from '@/entities/admin-old/roles/forms/schema'
import { roleService } from '@/entities/admin-old/roles/services/service'

export default function AdminRolesNewPage() {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: RolesFormFields): Promise<void> => {
      await roleService.create(data)
      await navigate('..')
    },
    [navigate],
  )

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <RolesForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
