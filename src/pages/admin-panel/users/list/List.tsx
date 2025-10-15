import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { userQueryKeys } from '@/entities/admin-old/users/services/keys'
import { userService } from '@/entities/admin-old/users/services/service'
import { adminUsersColumns } from '@/pages/admin-panel/users/list/columns'
import type { UserListResponse } from '@/shared/api/soil-lab/model'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminUsersListPage() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = useUrlPagination()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UserListResponse, Error>({
    queryKey: userQueryKeys.list(page, perPage),
    queryFn: () => {
      return userService.getList({
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
          columns={adminUsersColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
