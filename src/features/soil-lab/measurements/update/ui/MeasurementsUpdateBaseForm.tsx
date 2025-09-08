import { useMeasurementsFormFields } from '@/entities/soil-lab/measurements/ui/form/fields'
import type { MeasurementsUpdateFormFields } from '@/features/soil-lab/measurements/update/model/schema'
import type { MeasurementDetailResponse } from '@/shared/api/soil-lab/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type MeasurementsUpdateBaseFormProps = FormBaseProps<
  MeasurementsUpdateFormFields,
  MeasurementDetailResponse
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

      <F.moldingSandNumber />

      <F.moldingSandStrengthKgfCm2 />

      <F.moldingSandGasPermeability />

      <F.moldingSandMoisturePercent />

      <F.note />

      {/* <F.performedAt /> */}

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
