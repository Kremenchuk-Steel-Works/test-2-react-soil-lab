import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PermissionsForm from '@/entities/admin/permissions/forms/form'
import type { PermissionsFormFields } from '@/entities/admin/permissions/forms/schema'
import { permissionService } from '@/entities/admin/permissions/services/service'
import Button from '@/shared/ui/button/Button'

export default function AdminPermissionsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PermissionsFormFields) => {
    await permissionService.create(data)
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
          <PermissionsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
