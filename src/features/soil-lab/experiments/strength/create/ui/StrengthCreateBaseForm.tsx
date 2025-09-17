import {
  useStrengthFormFields,
  type TestStrengthResponse,
} from '@/entities/soil-lab/experiments/strength/ui/form/fields'
import type { StrengthCreateFormFields } from '@/features/soil-lab/experiments/strength/create/model/schema'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type StrengthCreateBaseFormProps = FormBaseProps<
  StrengthCreateFormFields,
  TestStrengthResponse
>

export function StrengthCreateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
}: StrengthCreateBaseFormProps) {
  const Form = useFormKit<StrengthCreateFormFields>()
  const F = useStrengthFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.Title />

      <F.moldingSandNumber />

      <F.compressiveStrengthDynamic />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
