import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { organizationQueryKeys } from '@/entities/admin/organizations/services/keys'
import { organizationService } from '@/entities/admin/organizations/services/service'
import type { OrganizationListResponse } from '@/entities/admin/organizations/types/response.dto'
import { adminOrganizationsColumns } from '@/pages/admin-panel/organizations/list/columns'
import { useUrlPagination } from '@/shared/hooks/useUrlPagination'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'
import { DataTable } from '@/widgets/data-table/DataTable'

export default function AdminOrganizationsList() {
  // Состояние из URL
  const { page, perPage, setSearchParams, isReady } = useUrlPagination()
  const navigate = useNavigate()

  // Получение данных, usersData

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<OrganizationListResponse, Error>({
    queryKey: organizationQueryKeys.list(page, perPage),
    queryFn: () => {
      return organizationService.getList({
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
          columns={adminOrganizationsColumns}
          setSearchParams={setSearchParams}
          page={page}
          perPage={perPage}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
