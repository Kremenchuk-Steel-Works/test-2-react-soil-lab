import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { UpdateUserFormFields } from "../../../features/admin/users/forms/schema"
import UpdateUsersForm from "../../../features/admin/users/forms/updateForm"
import type { UserDetailResponse } from "../../../features/admin/users/types/response.dto"
import { usersService } from "../../../features/admin/users/services/service"

export default function AdminUsersUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UserDetailResponse, Error>({
    queryKey: ["adminUserData", id],
    queryFn: () => usersService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: UpdateUserFormFields) => {
    // await apiPeopleAdd()
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

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}
      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <UpdateUsersForm
              onSubmit={handleSubmit}
              defaultValues={data}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
