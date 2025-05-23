import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { Role } from "../../../features/roles/types"
import { rolesService } from "../../../features/roles/services/service"
import type { RolesFormFields } from "../../../features/roles/forms/schema"
import RolesForm from "../../../features/roles/forms/form"

export default function AdminRolesUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data: person,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Role, Error>({
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
      {!isLoading && !isError && person && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <RolesForm
              onSubmit={handleSubmit}
              defaultValues={person}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
