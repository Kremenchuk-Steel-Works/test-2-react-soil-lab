import type { SamplesFormOptions } from '@/entities/soil-lab/samples/hooks/useSamplesFormOptions'
import { useSamplesFormFields } from '@/entities/soil-lab/samples/ui/form/fields'
import type { SamplesCreateFormFields } from '@/features/soil-lab/samples/create/model/schema'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

type Options = Pick<
  SamplesFormOptions,
  'loadMaterials' | 'defaultMaterials' | 'loadMaterialSources' | 'defaultMaterialSources'
>

type SamplesCreateBaseFormFieldsProps = {
  options: Options
}

export type SamplesCreateBaseFormProps = FormBaseProps<
  SamplesCreateFormFields,
  SampleDetailResponse
> &
  SamplesCreateBaseFormFieldsProps

export function SamplesCreateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
  options,
}: SamplesCreateBaseFormProps) {
  const Form = useFormKit<SamplesCreateFormFields>()
  const F = useSamplesFormFields(Form, { options, responseData })
  return (
    <>
      <F.Title />

      <F.materialId />

      <F.materialSourceId />

      <F.note />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
