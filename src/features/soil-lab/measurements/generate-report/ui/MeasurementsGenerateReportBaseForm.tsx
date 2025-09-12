import { useMeasurementsGenerateReportFormFields } from '@/features/soil-lab/measurements/generate-report/model/fields'
import type { MeasurementsGenerateReportFormFields } from '@/features/soil-lab/measurements/generate-report/model/schema'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type MeasurementsGenerateReportBaseFormProps =
  FormBaseProps<MeasurementsGenerateReportFormFields>

export function MeasurementsGenerateReportBaseForm({
  isSubmitting,
  submitBtnName,
}: MeasurementsGenerateReportBaseFormProps) {
  const Form = useFormKit<MeasurementsGenerateReportFormFields>()
  const F = useMeasurementsGenerateReportFormFields(Form, {})
  return (
    <>
      {/* <F.Title /> */}

      <F.dateFrom />

      <F.dateTo />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
