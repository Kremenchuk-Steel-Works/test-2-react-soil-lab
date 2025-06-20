import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import PermissionsForm from '@/entities/admin/permissions/forms/form'
import type { PermissionsFormFields } from '@/entities/admin/permissions/forms/schema'
import { permissionQueryKeys } from '@/entities/admin/permissions/services/keys'
import { permissionService } from '@/entities/admin/permissions/services/service'
import type { PermissionDetailResponse } from '@/entities/admin/permissions/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'

export default function AdminPermissionsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PermissionDetailResponse, Error>({
    queryKey: permissionQueryKeys.detail(id!),
    queryFn: () => permissionService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: PermissionsFormFields) => {
    await permissionService.update(id!, data)
    navigate('..')
    return data
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: PermissionDetailResponse): Partial<PermissionsFormFields> {
    return {
      ...obj,
      departmentId: obj.department?.id,
    }
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

      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <PermissionsForm
              onSubmit={handleSubmit}
              defaultValues={mapToFormDefaults(data)}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
