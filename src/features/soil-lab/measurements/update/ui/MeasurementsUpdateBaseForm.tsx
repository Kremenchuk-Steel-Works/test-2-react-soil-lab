import { useMeasurementsFormFields } from '@/entities/soil-lab/measurements/ui/form/fields'
import type { MeasurementsUpdateFormFields } from '@/features/soil-lab/measurements/update/model/schema'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type MeasurementsUpdateBaseFormProps = FormBaseProps<
  MeasurementsUpdateFormFields,
  MoldPassportDetailResponse
>

export function MeasurementsUpdateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
}: MeasurementsUpdateBaseFormProps) {
  const Form = useFormKit<MeasurementsUpdateFormFields>()
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

      <F.PerformedAtField />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
