import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import UsersForm from '@/entities/admin-old/users/forms/form'
import {
  userUpdateSchema,
  type UserUpdateFormFields,
} from '@/entities/admin-old/users/forms/schema'
import { userQueryKeys } from '@/entities/admin-old/users/services/keys'
import { userService } from '@/entities/admin-old/users/services/service'
import type { UserDetailResponse, UserUpdate } from '@/shared/api/soil-lab/model'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminUsersEditPage() {
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
    // Адаптер под обновление
    const payload: UserUpdate = {
      ...data,
      roleIds: data.roleIds ?? undefined,
      permissionIds: data.permissionIds ?? undefined,
    }
    await userService.update(id!, payload)
    await navigate('..')
    return data
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: UserDetailResponse): Partial<UserUpdateFormFields> {
    return {
      ...obj,
      roleIds: obj.roles?.map((rol) => rol.id) || [],
      permissionIds: obj.permissions?.map((perm) => perm.id) || [],
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
