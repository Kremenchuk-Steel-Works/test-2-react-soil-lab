import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useMoldPassportService } from '@/entities/molding-shop/mold-passport'
import {
  getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryKey,
  getGetMoldPassportsListApiV1MoldPassportsGetQueryKey,
} from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export default function MoldPassportDelete() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()

  const {
    mutate,
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

  const handleSubmit = () => {
    if (!id) return
    void mutate({ moldPassportId: id })
    void navigate('..')
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
