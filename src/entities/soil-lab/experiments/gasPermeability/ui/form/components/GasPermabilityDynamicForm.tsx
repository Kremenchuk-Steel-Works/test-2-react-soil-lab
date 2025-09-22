import {
  useGasPermeabilityFormFields,
  type TestGasPermeabilityResponse,
} from '@/entities/soil-lab/experiments/gasPermeability/ui/form/fields'
import type { GasPermeabilityFormFields } from '@/entities/soil-lab/experiments/gasPermeability/ui/form/lib/dynamic-sections'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

export function GasPermabilityDynamicForm() {
  const Form = useFormKit<GasPermeabilityFormFields>()
  const { responseData } = useDynamicMeta<Record<string, never>, TestGasPermeabilityResponse>()
  const F = useGasPermeabilityFormFields(Form, {
    responseData,
  })

  return <F.gasPermeability />
}
