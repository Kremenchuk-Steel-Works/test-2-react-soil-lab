import Button from "../../components/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { apiUsersAdd } from "../../services/user"
import {
  UserForm2,
  userSchema2,
  type UserFormFields2,
} from "../../components/Forms/UserForm"

export default function LibraryAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: UserFormFields2) => {
    await apiUsersAdd({
      email: data.email,
      rawPassword: data.rawPassword!,
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
          <UserForm2<UserFormFields2>
            schema={userSchema2}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
          />
        </div>
      </div>
    </>
  )
}
