import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { roleQueryKeys } from '@/entities/admin/roles/services/keys'
import { roleService } from '@/entities/admin/roles/services/service'
import type { RoleListResponse } from '@/entities/admin/roles/types/response.dto'
import { adminRolesColumns } from '@/pages/admin-panel/roles/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminRolesList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<RoleListResponse, Error>({
    queryKey: roleQueryKeys.list(page, perPage),
    queryFn: () => {
      return roleService.getList({
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
          columns={adminRolesColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
