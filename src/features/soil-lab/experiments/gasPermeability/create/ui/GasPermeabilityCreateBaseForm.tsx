import {
  useGasPermeabilityFormFields,
  type TestGasPermeabilityResponse,
} from '@/entities/soil-lab/experiments/gasPermeability/ui/form/fields'
import type { GasPermeabilityCreateFormFields } from '@/features/soil-lab/experiments/gasPermeability/create/model/schema'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type GasPermeabilityCreateBaseFormProps = FormBaseProps<
  GasPermeabilityCreateFormFields,
  TestGasPermeabilityResponse
>

export function GasPermeabilityCreateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
}: GasPermeabilityCreateBaseFormProps) {
  const Form = useFormKit<GasPermeabilityCreateFormFields>()
  const F = useGasPermeabilityFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.Title />

      <F.moldingSandNumber />
      <F.machineType />

      <F.gasPermeabilityDynamic />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
