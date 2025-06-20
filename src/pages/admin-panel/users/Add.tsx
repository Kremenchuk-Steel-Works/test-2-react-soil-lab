import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import UsersForm from '@/entities/admin/users/forms/form'
import { userSchema, type UserFormFields } from '@/entities/admin/users/forms/schema'
import { userService } from '@/entities/admin/users/services/service'
import Button from '@/shared/ui/button/Button'

export default function AdminUsersAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: UserFormFields) => {
    await userService.create(data)
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
          <UsersForm schema={userSchema} onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
