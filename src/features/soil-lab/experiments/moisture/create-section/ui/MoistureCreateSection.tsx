import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import { useMoistureFormFields } from '@/entities/soil-lab/experiments/moisture/ui/form/fields'
import { measurementsService } from '@/entities/soil-lab/measurements'
import type { MoistureCreateSectionFormFields } from '@/features/soil-lab/experiments/moisture/create-section/model/schema'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'
import { useSectionController } from '@/shared/hooks/react-hook-form/dynamic-fields/useSectionController'
import Button from '@/shared/ui/button/Button'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

const { moistureContentPercent } = moistureFieldRegistry
const { moldingSandNumber, machineType, ambientTempMoldAssemblyArea } = experimentsFieldRegistry

const BASE_KEYS = [moldingSandNumber.key, machineType.key, ambientTempMoldAssemblyArea.key]

export default function MoistureCreateSection() {
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
    sectionKey: moistureContentPercent.key,
    baseKeys: BASE_KEYS,
    onSubmit: onSectionSubmit,
  })

  const Form = useFormKit<MoistureCreateSectionFormFields>()
  const F = useMoistureFormFields(Form, {
    responseData: undefined,
  })

  if (!visible) return null

  return (
    <FieldsetWrapper title="Волога">
      <F.moistureContentPercentDynamic />

      <Button
        className="flex items-center justify-center gap-1 whitespace-nowrap"
        onClick={() => void submit()}
      >
        <Plus className="h-5 w-5" /> <span>{isSubmitting ? 'Відправка…' : 'Додати'}</span>
      </Button>
    </FieldsetWrapper>
  )
}
