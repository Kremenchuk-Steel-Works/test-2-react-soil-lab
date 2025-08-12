import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { moldPassportService } from '@/entities/molding-shop/mold-passport'
import { moldPassportColumns } from '@/pages/molding-shop/mold-passport/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import { getErrorMessage } from '@/shared/lib/axios'
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
  } = useQuery({
    ...moldPassportService.getList({
      page: page,
      perPage: perPage,
    }),
    placeholderData: keepPreviousData,
  })

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}

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
