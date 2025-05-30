import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { rolesService } from "../../../features/admin/roles/services/service"
import type { RolesFormFields } from "../../../features/admin/roles/forms/schema"
import RolesForm from "../../../features/admin/roles/forms/form"
import type { RoleDetailResponse } from "../../../features/admin/roles/types/response.dto"

export default function AdminRolesUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<RoleDetailResponse, Error>({
    queryKey: ["adminRoleData", id],
    queryFn: () => rolesService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: RolesFormFields) => {
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
            <RolesForm
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
