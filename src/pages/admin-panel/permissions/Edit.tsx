import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import PermissionsForm from '@/entities/admin-old/permissions/forms/form'
import type { PermissionsFormFields } from '@/entities/admin-old/permissions/forms/schema'
import { permissionQueryKeys } from '@/entities/admin-old/permissions/services/keys'
import { permissionService } from '@/entities/admin-old/permissions/services/service'
import type { PermissionDetailResponse } from '@/shared/api/soil-lab/model'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminPermissionsEditPage() {
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

  const handleSubmit = useCallback(
    async (data: PermissionsFormFields): Promise<void> => {
      await permissionService.update(id!, data)
      await navigate('..')
    },
    [navigate, id],
  )

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: PermissionDetailResponse): Partial<PermissionsFormFields> {
    return {
      ...obj,
    }
  }

  return (
    <>
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
