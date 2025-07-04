import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate, useResolvedPath } from 'react-router-dom'
import { libraryQueryKeys } from '@/entities/library/services/keys'
import { libraryService } from '@/entities/library/services/service.mock'
import type { LibraryListResponse } from '@/entities/library/types/response.dto'
import { libraryColumns } from '@/pages/library/list/columns'
import { usePaginationParams } from '@/shared/hooks/usePaginationParams'
import { useCanAccessPath } from '@/shared/hooks/usePermissions'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function LibraryList() {
  // Состояние из URL
  const { page, perPage, setSearchParams } = usePaginationParams()
  const navigate = useNavigate()

  const canAdd = useCanAccessPath(useResolvedPath('add').pathname)

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
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
        {canAdd && (
          <Button
            className="flex items-center justify-center gap-1 whitespace-nowrap"
            onClick={() => navigate('add')}
          >
            <Plus className="h-5 w-5" /> <span>Додати</span>
          </Button>
        )}
      </div>

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
