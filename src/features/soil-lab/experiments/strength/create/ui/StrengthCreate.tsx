import { useQueryClient } from '@tanstack/react-query'
import { measurementsService } from '@/entities/soil-lab/measurements'
import { strengthCreateFormDefaultValues } from '@/features/soil-lab/experiments/strength/create/model/schema'
import { StrengthCreateForm } from '@/features/soil-lab/experiments/strength/create/ui/StrengthCreateForm'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'

interface StrengthCreateProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function StrengthCreate({ onSuccess, onError }: StrengthCreateProps) {
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

  // const handleSubmit = async (data: StrengthCreateFormFields) => {
  const handleSubmit = async (data: MeasurementsCreateFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <StrengthCreateForm
      // <MeasurementsCreateForm
      defaultValues={strengthCreateFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}
