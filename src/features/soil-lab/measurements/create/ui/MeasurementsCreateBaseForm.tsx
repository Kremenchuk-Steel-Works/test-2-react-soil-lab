import { useMeasurementsFormFields } from '@/entities/soil-lab/measurements'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type MeasurementsCreateBaseFormProps = FormBaseProps<
  MeasurementsCreateFormFields,
  MoldPassportDetailResponse
>

export function MeasurementsCreateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
}: MeasurementsCreateBaseFormProps) {
  const Form = useFormKit<MeasurementsCreateFormFields>()
  const F = useMeasurementsFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.Title />

      <F.MoldingSandNumberField />

      <F.StrengthKgfCm2Field />

      <F.GasPermeabilityField />

      <F.MoisturePercentField />

      <F.NoteField />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
