import Button from "../../../components/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import {
  userSchema,
  type UserFormFields,
} from "../../../features/admin/users/forms/schema"
import UsersForm from "../../../features/admin/users/forms/form"
import { userService } from "../../../features/admin/users/services/service"

export default function AdminUsersAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: UserFormFields) => {
    await userService.create(data)
    navigate("..")
    return data
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("..")}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <UsersForm
            schema={userSchema}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
          />
        </div>
      </div>
    </>
  )
}
