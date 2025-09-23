import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { gasPermeabilityFieldRegistry } from '@/entities/soil-lab/experiments/gasPermeability/model/fields-registry'
import { useGasPermeabilityFormFields } from '@/entities/soil-lab/experiments/gasPermeability/ui/form/fields'
import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { measurementsService } from '@/entities/soil-lab/measurements'
import { type GasPermeabilityCreateSectionFormFields } from '@/features/soil-lab/experiments/gasPermeability/create-section/model/schema'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'
import { useSectionController } from '@/shared/hooks/react-hook-form/dynamic-fields/useSectionController'
import Button from '@/shared/ui/button/Button'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

const { gasPermeability } = gasPermeabilityFieldRegistry
const { moldingSandNumber, machineType, ambientTempMoldAssemblyArea } = experimentsFieldRegistry

const BASE_KEYS = [moldingSandNumber.key, machineType.key, ambientTempMoldAssemblyArea.key]

export default function GasPermeabilityCreateSection() {
  const queryClient = useQueryClient()

  // Локальная отправка
  const { mutateAsync } = measurementsService.create({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getGetMeasurementsListApiV1MeasurementsGetQueryKey(),
        })
      },
    },
  })

  const onSectionSubmit = useCallback(
    async (payload: MeasurementsCreateFormFields) => {
      await mutateAsync({ data: payload })
    },
    [mutateAsync],
  )

  const { visible, submit, isSubmitting } = useSectionController({
    sectionKey: gasPermeability.key,
    baseKeys: BASE_KEYS,
    onSubmit: onSectionSubmit,
  })

  const Form = useFormKit<GasPermeabilityCreateSectionFormFields>()
  const F = useGasPermeabilityFormFields(Form, {
    responseData: undefined,
  })

  if (!visible) return null

  return (
    <FieldsetWrapper title="Газопроникність">
      <F.gasPermeabilityDynamic />

      <Form.WithError name="root">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => void submit()}
        >
          <Plus className="h-5 w-5" /> <span>{isSubmitting ? 'Відправка…' : 'Додати'}</span>
        </Button>
      </Form.WithError>
    </FieldsetWrapper>
  )
}
