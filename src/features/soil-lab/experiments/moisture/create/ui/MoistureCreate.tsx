import { useQueryClient } from '@tanstack/react-query'
import { measurementsService } from '@/entities/soil-lab/measurements'
import {
  moistureCreateFormDefaultValues,
  type MoistureCreateFormFields,
} from '@/features/soil-lab/experiments/moisture/create/model/schema'
import { MoistureCreateForm } from '@/features/soil-lab/experiments/moisture/create/ui/MoistureCreateForm'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'

interface MoistureCreateProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function MoistureCreate({ onSuccess, onError }: MoistureCreateProps) {
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

  const handleSubmit = async (data: MoistureCreateFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <MoistureCreateForm
      defaultValues={moistureCreateFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}
