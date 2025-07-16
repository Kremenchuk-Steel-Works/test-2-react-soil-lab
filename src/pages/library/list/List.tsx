import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { libraryQueryKeys } from '@/entities/library/services/keys'
import { libraryService } from '@/entities/library/services/service.mock'
import type { LibraryListResponse } from '@/entities/library/types/response.dto'
import { libraryColumns } from '@/pages/library/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function LibraryList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<LibraryListResponse, Error>({
    queryKey: libraryQueryKeys.list(page, perPage),
    queryFn: () => {
      return libraryService.getList({
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
          columns={libraryColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
