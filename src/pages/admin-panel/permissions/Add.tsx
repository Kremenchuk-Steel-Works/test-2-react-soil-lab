import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PermissionsForm from '@/entities/admin/permissions/forms/form'
import type { PermissionsFormFields } from '@/entities/admin/permissions/forms/schema'
import { permissionService } from '@/entities/admin/permissions/services/service'

export default function AdminPermissionsAdd() {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: PermissionsFormFields): Promise<void> => {
      await permissionService.create(data)
      await navigate('..')
    },
    [navigate],
  )

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <PermissionsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
