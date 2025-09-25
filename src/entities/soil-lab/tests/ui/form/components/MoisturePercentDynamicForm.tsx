import { useTestsFormFields } from '@/entities/soil-lab/tests/ui/form/fields'
import type { Measurement1FormFields } from '@/entities/soil-lab/tests/ui/form/lib/dynamic-sections'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

export function MoisturePercentDynamicForm() {
  const Form = useFormKit<Measurement1FormFields>()
  const { responseData } = useDynamicMeta<Record<string, never>, SampleDetailResponse>()
  const F = useTestsFormFields(Form, {
    responseData,
  })

  return <F.moisturePercent />
}
