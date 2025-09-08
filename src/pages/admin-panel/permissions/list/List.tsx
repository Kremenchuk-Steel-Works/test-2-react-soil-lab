import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { permissionQueryKeys } from '@/entities/admin-old/permissions/services/keys'
import { permissionService } from '@/entities/admin-old/permissions/services/service'
import { adminPermissionsColumns } from '@/pages/admin-panel/permissions/list/columns'
import type { PermissionListResponse } from '@/shared/api/soil-lab/model'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminPermissionsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PermissionListResponse, Error>({
    queryKey: permissionQueryKeys.list(page, perPage),
    queryFn: () => {
      return permissionService.getList({
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
          columns={adminPermissionsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
