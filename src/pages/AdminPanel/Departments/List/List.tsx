import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from "../../../../components/Button/Button"
import { DataTable } from "../../../../components/Table/DataTable"
import { adminDepartmentsColumns } from "./columns"
import { departmentsService } from "../../../../features/admin/departments/services/service"
import type { DepartmentListResponse } from "../../../../features/admin/departments/types/response.dto"

export default function AdminDepartmentsList() {
  // Состояние из URL
  const [searchParams, setSearchParams] = useSearchParams()
  const pageFromUrl = Number(searchParams.get("page")) || 1
  const rawPerPageFromUrl = Number(searchParams.get("perPage")) || 10
  const perPageFromUrl = rawPerPageFromUrl > 20 ? 20 : rawPerPageFromUrl

  const navigate = useNavigate()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<DepartmentListResponse, Error>({
    queryKey: ["adminDepartmentsData", pageFromUrl, perPageFromUrl],
    queryFn: () => {
      return departmentsService.getList({
        page: pageFromUrl,
        perPage: perPageFromUrl,
      })
    },
    placeholderData: keepPreviousData,
  })

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("..")}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("add")}
        >
          <Plus className="w-5 h-5" /> <span>Додати</span>
        </Button>
      </div>

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}

      {!isLoading && !isError && data && (
        <DataTable
          data={data?.data ?? []}
          columns={adminDepartmentsColumns}
          setSearchParams={setSearchParams}
          page={pageFromUrl}
          perPage={perPageFromUrl}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
