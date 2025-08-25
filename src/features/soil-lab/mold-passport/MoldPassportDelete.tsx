import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useMoldPassportService } from '@/entities/soil-lab/mold-passport'
import {
  getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryKey,
  getGetMoldPassportsListApiV1MoldPassportsGetQueryKey,
} from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

interface MoldPassportDeleteProps {
  id: string
}

export default function MoldPassportDelete({ id }: MoldPassportDeleteProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    mutateAsync,
    isPending,
    error: mutationError,
  } = useMoldPassportService.delete({
    mutation: {
      onSuccess: (_data, variables) => {
        const queryKeyList = getGetMoldPassportsListApiV1MoldPassportsGetQueryKey()
        const queryKeyDetail = getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryKey(
          variables.moldPassportId,
        )

        return Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeyList }),
          queryClient.invalidateQueries({ queryKey: queryKeyDetail }),
        ])
      },
    },
  })

  // Запрос на удаление
  const handleSubmit = async () => {
    if (!id) return
    await mutateAsync({ moldPassportId: id })
    navigate('..')
  }

  return (
    <>
      <h5 className="layout-text">Ви впевнені, що хочете видалити?</h5>

      <div>
        <ConfiguredButton btnType="delete" onClick={handleSubmit} disabled={isPending} />
      </div>

      {mutationError && (
        <AlertMessage type={AlertType.ERROR} message={getErrorMessage(mutationError)} />
      )}
    </>
  )
}
