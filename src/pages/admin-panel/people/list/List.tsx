import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { personQueryKeys } from '@/entities/admin/people/services/keys'
import { personService } from '@/entities/admin/people/services/service'
import type { PersonListResponse } from '@/entities/admin/people/types/response.dto'
import { adminPeopleColumns } from '@/pages/admin-panel/people/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminPeopleList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных, usersData
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PersonListResponse, Error>({
    queryKey: personQueryKeys.list(page, perPage),
    queryFn: () => {
      return personService.getList({
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
          columns={adminPeopleColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
