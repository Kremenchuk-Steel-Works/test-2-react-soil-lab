import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import RolesForm from '@/entities/admin-old/roles/forms/form'
import type { RolesFormFields } from '@/entities/admin-old/roles/forms/schema'
import { roleQueryKeys } from '@/entities/admin-old/roles/services/keys'
import { roleService } from '@/entities/admin-old/roles/services/service'
import type { RoleDetailResponse, RoleUpdate } from '@/shared/api/soil-lab/model'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminRolesUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<RoleDetailResponse, Error>({
    queryKey: roleQueryKeys.detail(id!),
    queryFn: () => roleService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: RolesFormFields) => {
    // Адаптер под обновление
    const payload: RoleUpdate = {
      ...data,
      permissionIds: data.permissionIds ?? undefined,
    }

    await roleService.update(id!, payload)
    await navigate('..')
    return data
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: RoleDetailResponse): Partial<RolesFormFields> {
    return {
      ...obj,
      permissionIds: obj.permissions?.map((perm) => perm.id) as [string, ...string[]] | undefined,
    }
  }

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <RolesForm
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
