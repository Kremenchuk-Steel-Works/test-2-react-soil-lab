import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from '@/shared/ui/button/Button'
import { DataTable } from '@/widgets/data-table/DataTable'
import { adminDepartmentsColumns } from '@/pages/admin-panel/departments/list/columns'
import { departmentService } from '@/entities/admin/departments/services/service'
import type { DepartmentListResponse } from '@/entities/admin/departments/types/response.dto'
import { usePaginationParams } from '@/shared/hooks/usePaginationParams'
import { departmentQueryKeys } from '@/entities/admin/departments/services/keys'
import AlertMessage, {
  AlertType,
} from '@/shared/ui/alert-message/AlertMessage'

export default function AdminDepartmentsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = usePaginationParams()
  const navigate = useNavigate()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<DepartmentListResponse, Error>({
    queryKey: departmentQueryKeys.list(page, perPage),
    queryFn: () => {
      return departmentService.getList({
        page: page,
        perPage: perPage,
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
        <AlertMessage type={AlertType.ERROR} message={queryError?.message} />
      )}

      {!isLoading && !isError && data && (
        <DataTable
          data={data?.data ?? []}
          columns={adminDepartmentsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
