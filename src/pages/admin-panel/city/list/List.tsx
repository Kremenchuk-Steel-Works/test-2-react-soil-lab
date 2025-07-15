import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cityQueryKeys } from '@/entities/admin/city/services/keys'
import { cityService } from '@/entities/admin/city/services/service'
import type { CityListResponse } from '@/entities/admin/city/types/response.dto'
import { adminCityColumns } from '@/pages/admin-panel/city/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminCityList() {
  // Состояние из URL
  const { page, perPage, setSearchParams, isReady } = useUrlPagination()
  const navigate = useNavigate()

  // Получение данных
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CityListResponse, Error>({
    queryKey: cityQueryKeys.list(page, perPage),
    queryFn: () => {
      return cityService.getList({
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
          columns={adminCityColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
