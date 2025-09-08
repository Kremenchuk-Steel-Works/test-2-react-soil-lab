import { useQueryClient } from '@tanstack/react-query'
import { measurementsService } from '@/entities/soil-lab/measurements'
import {
  measurementsCreateFormDefaultValues,
  type MeasurementsCreateFormFields,
} from '@/features/soil-lab/measurements/create/model/schema'
import { MeasurementsCreateForm } from '@/features/soil-lab/measurements/create/ui/MeasurementsCreateForm'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'

interface MeasurementsCreateProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function MeasurementsCreate({ onSuccess, onError }: MeasurementsCreateProps) {
  const queryClient = useQueryClient()

  const { mutateAsync } = measurementsService.create({
    mutation: {
      onSuccess: (res) => {
        void queryClient.invalidateQueries({
          queryKey: getGetMeasurementsListApiV1MeasurementsGetQueryKey(),
        })
        onSuccess?.(res)
      },
      onError: (err) => onError?.(err),
    },
  })

  const handleSubmit = async (data: MeasurementsCreateFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <MeasurementsCreateForm
      defaultValues={measurementsCreateFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}
