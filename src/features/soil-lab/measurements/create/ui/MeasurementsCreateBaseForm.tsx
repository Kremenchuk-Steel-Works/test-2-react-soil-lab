import { useMeasurementsFormFields } from '@/entities/soil-lab/measurements'
import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import type { MeasurementDetailResponse } from '@/shared/api/soil-lab/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type MeasurementsCreateBaseFormProps = FormBaseProps<
  MeasurementsCreateFormFields,
  MeasurementDetailResponse
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

      <F.moldingSandNumber />

      <F.moldingSandStrengthKgfCm2 />

      <F.moldingSandGasPermeability />

      <F.moldingSandMoisturePercent />

      <F.note />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
