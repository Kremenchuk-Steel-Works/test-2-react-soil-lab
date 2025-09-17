import {
  useStrengthFormFields,
  type TestStrengthResponse,
} from '@/entities/soil-lab/experiments/strength/ui/form/fields'
import type { StrengthContentPercentFormFields } from '@/entities/soil-lab/experiments/strength/ui/form/lib/dynamic-sections'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

export function CompressiveStrengthDynamicForm() {
  const Form = useFormKit<StrengthContentPercentFormFields>()
  const { responseData } = useDynamicMeta<Record<string, never>, TestStrengthResponse>()
  const F = useStrengthFormFields(Form, {
    responseData,
  })

  return <F.compressiveStrength />
}
