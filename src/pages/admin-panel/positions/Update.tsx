import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import PositionsForm from '@/entities/admin/positions/forms/form'
import type { PositionsFormFields } from '@/entities/admin/positions/forms/schema'
import { positionQueryKeys } from '@/entities/admin/positions/services/keys'
import { positionService } from '@/entities/admin/positions/services/service'
import type { PositionDetailResponse } from '@/entities/admin/positions/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminPositionsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PositionDetailResponse, Error>({
    queryKey: positionQueryKeys.detail(id!),
    queryFn: () => positionService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = useCallback(
    async (data: PositionsFormFields): Promise<void> => {
      await positionService.update(id!, data)
      await navigate('..')
    },
    [navigate, id],
  )

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <PositionsForm onSubmit={handleSubmit} defaultValues={data} submitBtnName="Оновити" />
          </div>
        </div>
      )}
    </>
  )
}
