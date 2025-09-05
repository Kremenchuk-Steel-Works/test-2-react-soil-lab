import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { departmentQueryKeys } from '@/entities/admin-old/departments/services/keys'
import { departmentService } from '@/entities/admin-old/departments/services/service'
import type { DepartmentListResponse } from '@/entities/admin-old/departments/types/response.dto'
import { adminDepartmentsColumns } from '@/pages/admin-panel/departments/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminDepartmentsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

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
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

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
