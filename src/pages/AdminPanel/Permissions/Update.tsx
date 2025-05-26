import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { Permission } from "../../../features/admin/permissions/types"
import type { PermissionsFormFields } from "../../../features/admin/permissions/forms/schema"
import { permissionsService } from "../../../features/admin/permissions/services/service"
import PermissionsForm from "../../../features/admin/permissions/forms/form"

export default function AdminPermissionsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Permission, Error>({
    queryKey: ["adminPermissionData", id],
    queryFn: () => permissionsService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: PermissionsFormFields) => {
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
            <PermissionsForm
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
