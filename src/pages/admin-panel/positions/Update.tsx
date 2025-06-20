import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import PositionsForm from '@/entities/admin/positions/forms/form'
import type { PositionsFormFields } from '@/entities/admin/positions/forms/schema'
import { positionQueryKeys } from '@/entities/admin/positions/services/keys'
import { positionService } from '@/entities/admin/positions/services/service'
import type { PositionDetailResponse } from '@/entities/admin/positions/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'

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

  const handleSubmit = async (data: PositionsFormFields) => {
    await positionService.update(id!, data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
      </div>

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
