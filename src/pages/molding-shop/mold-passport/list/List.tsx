import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { moldPassportService } from '@/entities/molding-shop/mold-passport/api/service'
import { moldPassportColumns } from '@/pages/molding-shop/mold-passport/list/columns'
import type { PersonListResponse } from '@/shared/api/main-service/model'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table'

export default function MoldPassportList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PersonListResponse, Error>(
    moldPassportService.getList(
      {
        page,
        perPage,
      },
      { query: { placeholderData: keepPreviousData } },
    ),
  )

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <DataTable
          data={data?.data ?? []}
          columns={moldPassportColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
