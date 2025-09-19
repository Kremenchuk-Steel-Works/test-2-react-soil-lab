import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { strengthFieldRegistry } from '@/entities/soil-lab/experiments/strength/model/fields-registry'
import { useStrengthFormFields } from '@/entities/soil-lab/experiments/strength/ui/form/fields'
import { measurementsService } from '@/entities/soil-lab/measurements'
import type { StrengthCreateSectionFormFields } from '@/features/soil-lab/experiments/strength/create-section/model/schema'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import { getGetMeasurementsListApiV1MeasurementsGetQueryKey } from '@/shared/api/soil-lab/endpoints/measurements/measurements'
import { useSectionController } from '@/shared/hooks/react-hook-form/dynamic-fields/useSectionController'
import Button from '@/shared/ui/button/Button'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

const { compressiveStrength } = strengthFieldRegistry
const { moldingSandNumber, machineType, ambientTempMoldAssemblyArea } = experimentsFieldRegistry

const BASE_KEYS = [moldingSandNumber.key, machineType.key, ambientTempMoldAssemblyArea.key]

export default function StrengthCreateSection() {
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
    sectionKey: compressiveStrength.key,
    baseKeys: BASE_KEYS,
    onSubmit: onSectionSubmit,
  })

  const Form = useFormKit<StrengthCreateSectionFormFields>()
  const F = useStrengthFormFields(Form, {
    responseData: undefined,
  })

  if (!visible) return null

  return (
    <FieldsetWrapper title="Міцність суміші">
      <F.compressiveStrengthDynamic />

      <Button
        className="flex items-center justify-center gap-1 whitespace-nowrap"
        onClick={() => void submit()}
      >
        <Plus className="h-5 w-5" /> <span>{isSubmitting ? 'Відправка…' : 'Додати'}</span>
      </Button>
    </FieldsetWrapper>
  )
}
