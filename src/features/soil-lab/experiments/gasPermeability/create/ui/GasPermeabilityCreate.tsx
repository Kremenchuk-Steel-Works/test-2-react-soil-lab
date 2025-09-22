import { useQueryClient } from '@tanstack/react-query'
import { measurementsService } from '@/entities/soil-lab/measurements'
import { gasPermeabilityCreateFormDefaultValues } from '@/features/soil-lab/experiments/gasPermeability/create/model/schema'
import { GasPermeabilityCreateForm } from '@/features/soil-lab/experiments/gasPermeability/create/ui/GasPermeabilityCreateForm'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'

interface GasPermeabilityCreateProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function GasPermeabilityCreate({ onSuccess, onError }: GasPermeabilityCreateProps) {
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

  // const handleSubmit = async (data: GasPermeabilityCreateFormFields) => {
  const handleSubmit = async (data: MeasurementsCreateFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <GasPermeabilityCreateForm
      // <MeasurementsCreateForm
      defaultValues={gasPermeabilityCreateFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}
