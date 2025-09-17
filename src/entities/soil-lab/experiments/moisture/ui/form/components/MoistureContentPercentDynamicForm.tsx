import {
  useMoistureFormFields,
  type TestMoistureResponse,
} from '@/entities/soil-lab/experiments/moisture/ui/form/fields'
import type { MoistureContentPercentFormFields } from '@/entities/soil-lab/experiments/moisture/ui/form/lib/dynamic-sections'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

export function MoistureContentPercentDynamicForm() {
  const Form = useFormKit<MoistureContentPercentFormFields>()
  const { responseData } = useDynamicMeta<Record<string, never>, TestMoistureResponse>()
  const F = useMoistureFormFields(Form, {
    responseData,
  })

  return <F.moistureContentPercent />
}
