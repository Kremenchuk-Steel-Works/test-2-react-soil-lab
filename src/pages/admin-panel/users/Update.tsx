import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import UsersForm from '@/entities/admin/users/forms/form'
import { userUpdateSchema, type UserUpdateFormFields } from '@/entities/admin/users/forms/schema'
import { userQueryKeys } from '@/entities/admin/users/services/keys'
import { userService } from '@/entities/admin/users/services/service'
import type { UserDetailResponse } from '@/entities/admin/users/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminUsersUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UserDetailResponse, Error>({
    queryKey: userQueryKeys.detail(id!),
    queryFn: () => userService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: UserUpdateFormFields) => {
    await userService.update(id!, data)
    await navigate('..')
    return data
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: UserDetailResponse): Partial<UserUpdateFormFields> {
    return {
      ...obj,
      rolesIds: obj.roles?.map((rol) => rol.id) || [],
      permissionsIds: obj.permissions?.map((perm) => perm.id) || [],
    }
  }

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <UsersForm
              schema={userUpdateSchema}
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
