import {
  useSamplesFormFields,
  type SamplesCreateOptions,
} from '@/entities/soil-lab/samples/ui/form/fields'
import type { SamplesCreateFormFields } from '@/features/soil-lab/samples/create/model/schema'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type SamplesCreateBaseFormProps = FormBaseProps<
  SamplesCreateFormFields,
  SampleDetailResponse
> &
  SamplesCreateOptions

export function SamplesCreateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
  options,
}: SamplesCreateBaseFormProps) {
  const Form = useFormKit<SamplesCreateFormFields>()
  const F = useSamplesFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.Title />

      <F.moldingSandRecipe options={options} />

      {/* <F.receivedAt /> */}

      <F.note />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
