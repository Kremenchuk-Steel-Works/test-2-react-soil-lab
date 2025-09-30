import { keepPreviousData } from '@tanstack/react-query'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import SamplesGenerateReportPage from '@/pages/soil-lab/samples/ui/GenerateReport'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table'
import { samplesColumns } from './columns'

export default function SamplesList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData
  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = samplesService.getList(
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
          columns={samplesColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={responseData?.totalPages}
          headerComponents={<SamplesGenerateReportPage />}
          hideEmptyColumns={true}
        />
      )}
    </>
  )
}
