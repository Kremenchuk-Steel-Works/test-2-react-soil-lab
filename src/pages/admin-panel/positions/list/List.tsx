import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { positionQueryKeys } from '@/entities/admin/positions/services/keys'
import { positionService } from '@/entities/admin/positions/services/service'
import type { PositionListResponse } from '@/entities/admin/positions/types/response.dto'
import { adminPositionsColumns } from '@/pages/admin-panel/positions/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminPositionsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams, isReady } = useUrlPagination()
  const navigate = useNavigate()

  // Получение данных, usersData
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PositionListResponse, Error>({
    queryKey: positionQueryKeys.list(page, perPage),
    queryFn: () => {
      return positionService.getList({
        page: page,
        perPage: perPage,
      })
    },
    placeholderData: keepPreviousData,
    enabled: isReady,
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
          columns={adminPositionsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
