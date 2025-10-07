import { keepPreviousData } from '@tanstack/react-query'
import { testsService } from '@/entities/soil-lab/tests/api/service'
import { testsColumns } from '@/pages/soil-lab/tests/ui/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table'

export default function TestsListPage() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData
  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = testsService.getList(
    { page: page, per_page: perPage },
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
          columns={testsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={responseData?.totalPages}
        />
      )}
    </>
  )
}
