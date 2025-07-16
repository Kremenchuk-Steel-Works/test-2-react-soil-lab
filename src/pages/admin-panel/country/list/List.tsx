import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { countryQueryKeys } from '@/entities/admin/country/services/keys'
import { countryService } from '@/entities/admin/country/services/service'
import type { CountryListResponse } from '@/entities/admin/country/types/response.dto'
import { adminCountryColumns } from '@/pages/admin-panel/country/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminCountryList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CountryListResponse, Error>({
    queryKey: countryQueryKeys.list(page, perPage),
    queryFn: () => {
      return countryService.getList({
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
          columns={adminCountryColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
