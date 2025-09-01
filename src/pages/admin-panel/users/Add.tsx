import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import UsersForm from '@/entities/admin/users/forms/form'
import { userSchema, type UserFormFields } from '@/entities/admin/users/forms/schema'
import { userService } from '@/entities/admin/users/services/service'

export default function AdminUsersAdd() {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: UserFormFields): Promise<void> => {
      await userService.create(data)
      await navigate('..')
    },
    [navigate],
  )

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <UsersForm schema={userSchema} onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
