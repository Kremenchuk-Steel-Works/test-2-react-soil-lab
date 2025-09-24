import { useTestsFormFields } from '@/entities/soil-lab/tests/ui/form/fields'
import type { Measurement1FormFields } from '@/entities/soil-lab/tests/ui/form/lib/dynamic-sections'
import type { TestDetailResponse } from '@/shared/api/soil-lab-2/model'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

export function GasPermabilityDynamicForm() {
  const Form = useFormKit<Measurement1FormFields>()
  const { responseData } = useDynamicMeta<Record<string, never>, TestDetailResponse>()
  const F = useTestsFormFields(Form, {
    responseData,
  })

  return <F.gasPermeability />
}
