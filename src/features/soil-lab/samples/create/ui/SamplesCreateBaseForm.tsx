import { useSamplesFormFields } from '@/entities/soil-lab/samples/ui/form/fields'
import type { SamplesCreateFormFields } from '@/features/soil-lab/samples/create/model/schema'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type SamplesCreateBaseFormProps = FormBaseProps<
  SamplesCreateFormFields,
  SampleDetailResponse
>

export function SamplesCreateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
}: SamplesCreateBaseFormProps) {
  const Form = useFormKit<SamplesCreateFormFields>()
  const F = useSamplesFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.Title />

      <F.moldingSandRecipe />

      <F.receivedAt />

      <F.note />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
