import { useNavigate } from 'react-router-dom'
import RolesForm from '@/entities/admin/roles/forms/form'
import type { RolesFormFields } from '@/entities/admin/roles/forms/schema'
import { roleService } from '@/entities/admin/roles/services/service'

export default function AdminRolesAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: RolesFormFields) => {
    await roleService.create(data)
    navigate('..')
    return data
  }

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
