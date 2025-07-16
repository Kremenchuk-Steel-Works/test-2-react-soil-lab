import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { organizationQueryKeys } from '@/entities/admin/organizations/services/keys'
import { organizationService } from '@/entities/admin/organizations/services/service'
import type { OrganizationListResponse } from '@/entities/admin/organizations/types/response.dto'
import { adminOrganizationsColumns } from '@/pages/admin-panel/organizations/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminOrganizationsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<OrganizationListResponse, Error>({
    queryKey: organizationQueryKeys.list(page, perPage),
    queryFn: () => {
      return organizationService.getList({
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
          columns={adminOrganizationsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
