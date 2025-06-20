import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { personQueryKeys } from '@/entities/admin/people/services/keys'
import { personService } from '@/entities/admin/people/services/service'
import type { PersonListResponse } from '@/entities/admin/people/types/response.dto'
import { adminPeopleColumns } from '@/pages/admin-panel/people/list/columns'
import { usePaginationParams } from '@/shared/hooks/usePaginationParams'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminPeopleList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = usePaginationParams()
  const navigate = useNavigate()

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
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('add')}
        >
          <Plus className="h-5 w-5" /> <span>Додати</span>
        </Button>
      </div>

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
