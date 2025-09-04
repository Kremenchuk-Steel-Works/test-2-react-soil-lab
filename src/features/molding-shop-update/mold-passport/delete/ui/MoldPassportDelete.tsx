import { useQueryClient } from '@tanstack/react-query'
import { moldPassportService } from '@/entities/molding-shop-update/mold-passport'
import {
  getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryKey,
  getGetMoldPassportsListApiV1MoldPassportsGetQueryKey,
} from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

interface MoldPassportDeleteProps {
  id: string
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function MoldPassportDelete({ id, onSuccess, onError }: MoldPassportDeleteProps) {
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending,
    error: mutationError,
  } = moldPassportService.delete({
    mutation: {
      onSuccess: (res, variables) => {
        const queryKeyList = getGetMoldPassportsListApiV1MoldPassportsGetQueryKey()
        const queryKeyDetail = getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryKey(
          variables.moldPassportId,
        )

        return Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeyList }),
          queryClient.invalidateQueries({ queryKey: queryKeyDetail }),
        ]).finally(() => {
          onSuccess?.(res)
        })
      },
      onError: (err) => onError?.(err),
    },
  })

  // Запрос на удаление
  const handleSubmit = () => {
    if (!id || isPending) return
    mutate({ moldPassportId: id })
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
