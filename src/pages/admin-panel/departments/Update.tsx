import Button from "../../../shared/ui/button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { departmentService } from "../../../entities/admin/departments/services/service"
import type { DepartmentsFormFields } from "../../../entities/admin/departments/forms/schema"
import DepartmentsForm from "../../../entities/admin/departments/forms/form"
import type { DepartmentDetailResponse } from "../../../entities/admin/departments/types/response.dto"
import { departmentQueryKeys } from "../../../entities/admin/departments/services/keys"
import AlertMessage, {
  AlertType,
} from "../../../shared/ui/alert-message/AlertMessage"

export default function AdminDepartmentsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<DepartmentDetailResponse, Error>({
    queryKey: departmentQueryKeys.detail(id!),
    queryFn: () => departmentService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: DepartmentsFormFields) => {
    await departmentService.update(id!, data)
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
        <AlertMessage type={AlertType.ERROR} message={queryError?.message} />
      )}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <DepartmentsForm
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
