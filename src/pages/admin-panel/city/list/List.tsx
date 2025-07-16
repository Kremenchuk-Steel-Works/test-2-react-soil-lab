import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { cityQueryKeys } from '@/entities/admin/city/services/keys'
import { cityService } from '@/entities/admin/city/services/service'
import type { CityListResponse } from '@/entities/admin/city/types/response.dto'
import { adminCityColumns } from '@/pages/admin-panel/city/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminCityList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CityListResponse, Error>({
    queryKey: cityQueryKeys.list(page, perPage),
    queryFn: () => {
      return cityService.getList({
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
          columns={adminCityColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
