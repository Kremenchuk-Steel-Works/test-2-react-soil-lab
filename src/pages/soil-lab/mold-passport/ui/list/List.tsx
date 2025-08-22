import { keepPreviousData } from '@tanstack/react-query'
import { useMoldPassportService } from '@/entities/soil-lab/mold-passport'
import { moldPassportColumns } from '@/pages/soil-lab/mold-passport/ui/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table'

export default function MoldPassportList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData
  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = useMoldPassportService.getList(
    { page: page, perPage: perPage },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    },
  )

  return (
    <>
      {queryError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}

      {!isLoading && !queryError && responseData && (
        <DataTable
          data={responseData?.data ?? []}
          columns={moldPassportColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={responseData?.totalPages}
        />
      )}
    </>
  )
}
