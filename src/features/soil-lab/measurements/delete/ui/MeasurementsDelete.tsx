import { useQueryClient } from '@tanstack/react-query'
import { measurementsService } from '@/entities/soil-lab/measurements'
import {
  getGetMeasurementApiV1MeasurementsMeasurementIdGetQueryKey,
  getGetMeasurementsListApiV1MeasurementsGetQueryKey,
} from '@/shared/api/soil-lab/endpoints/measurements/measurements'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

interface MeasurementsDeleteProps {
  id: string
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function MeasurementsDelete({ id, onSuccess, onError }: MeasurementsDeleteProps) {
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending,
    error: mutationError,
  } = measurementsService.delete({
    mutation: {
      onSuccess: (res, variables) => {
        const queryKeyList = getGetMeasurementsListApiV1MeasurementsGetQueryKey()
        const queryKeyDetail = getGetMeasurementApiV1MeasurementsMeasurementIdGetQueryKey(
          variables.measurementId,
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
    mutate({ measurementId: id })
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
