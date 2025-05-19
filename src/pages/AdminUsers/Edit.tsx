import Button from "../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { apiUsersDetail, apiUsersEdit } from "../../services/user"
import { UserForm, userSchema } from "../../components/Forms/UserForm"
import { useQuery } from "@tanstack/react-query"
import type { User } from "../../types/User"
import { z } from "zod"

// Создание новой схемы без поля raw_password
export const userSchemaWithoutPassword = userSchema.omit({ raw_password: true })
export type UserFormFieldsWithoutPassword = z.infer<
  typeof userSchemaWithoutPassword
>

export default function AdminUsersEdit() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data: user,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<User, Error>({
    queryKey: ["userDetailsData", id],
    queryFn: () => apiUsersDetail(id!),
    enabled: !!id && /^\d+$/.test(id),
  })

  const handleSubmit = async (data: UserFormFieldsWithoutPassword) => {
    await apiUsersEdit(id!, {
      email: data.email,
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

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}
      {!isLoading && !isError && user && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <UserForm<UserFormFieldsWithoutPassword>
              defaultValues={user}
              onSubmit={handleSubmit}
              submitBtnName="Змінити"
              schema={userSchemaWithoutPassword}
              showPasswordField={false}
            />
          </div>
        </div>
      )}
    </>
  )
}
