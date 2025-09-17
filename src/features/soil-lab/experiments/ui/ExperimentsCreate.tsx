import { useQueryClient } from '@tanstack/react-query'
import { measurementsService } from '@/entities/soil-lab/measurements'
import { experimentsCreateFormDefaultValues } from '@/features/soil-lab/experiments/model/schema'
import { ExperimentsCreateForm } from '@/features/soil-lab/experiments/ui/ExperimentsCreateForm'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'

interface ExperimentsCreateProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function ExperimentsCreate({ onSuccess, onError }: ExperimentsCreateProps) {
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

  // const handleSubmit = async (data: ExperimentsCreateFormFields) => {
  const handleSubmit = async (data: MeasurementsCreateFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <ExperimentsCreateForm
      // <MeasurementsCreateForm
      defaultValues={experimentsCreateFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}
