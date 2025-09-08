import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { roleQueryKeys } from '@/entities/admin-old/roles/services/keys'
import { roleService } from '@/entities/admin-old/roles/services/service'
import { adminRolesColumns } from '@/pages/admin-panel/roles/list/columns'
import type { RoleListResponse } from '@/shared/api/soil-lab/model'
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
