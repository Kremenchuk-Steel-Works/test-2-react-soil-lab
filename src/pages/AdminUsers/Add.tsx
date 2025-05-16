import Button from "../../components/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { apiUsersAdd } from "../../services/user"
import {
  UserForm,
  userSchema,
  type FormUserFields,
} from "../../components/Forms/UserForm"

export default function AdminUsersAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: FormUserFields) => {
    await apiUsersAdd({
      email: data.email,
      raw_password: data.raw_password!,
      profile: data.profile,
    })
    navigate("..")
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
          <UserForm<FormUserFields>
            schema={userSchema}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
          />
        </div>
      </div>
    </>
  )
}
