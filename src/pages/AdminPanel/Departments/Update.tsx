import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { departmentsService } from "../../../features/admin/departments/services/service"
import type { DepartmentsFormFields } from "../../../features/admin/departments/forms/schema"
import DepartmentsForm from "../../../features/admin/departments/forms/form"
import type { DepartmentDetailResponse } from "../../../features/admin/departments/types/response.dto"

export default function AdminDepartmentsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<DepartmentDetailResponse, Error>({
    queryKey: ["adminDepartmentData", id],
    queryFn: () => departmentsService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: DepartmentsFormFields) => {
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
