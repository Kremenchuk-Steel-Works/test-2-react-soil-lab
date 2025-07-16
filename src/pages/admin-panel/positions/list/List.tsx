import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { positionQueryKeys } from '@/entities/admin/positions/services/keys'
import { positionService } from '@/entities/admin/positions/services/service'
import type { PositionListResponse } from '@/entities/admin/positions/types/response.dto'
import { adminPositionsColumns } from '@/pages/admin-panel/positions/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminPositionsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PositionListResponse, Error>({
    queryKey: positionQueryKeys.list(page, perPage),
    queryFn: () => {
      return positionService.getList({
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
          columns={adminPositionsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
