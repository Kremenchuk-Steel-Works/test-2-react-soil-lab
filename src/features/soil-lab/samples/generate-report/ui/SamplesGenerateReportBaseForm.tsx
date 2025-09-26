import { useSamplesGenerateReportFormFields } from '@/features/soil-lab/samples/generate-report/model/fields'
import type { SamplesGenerateReportFormFields } from '@/features/soil-lab/samples/generate-report/model/schema'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type SamplesGenerateReportBaseFormProps = FormBaseProps<SamplesGenerateReportFormFields>

export function SamplesGenerateReportBaseForm({
  isSubmitting,
  submitBtnName,
}: SamplesGenerateReportBaseFormProps) {
  const Form = useFormKit<SamplesGenerateReportFormFields>()
  const F = useSamplesGenerateReportFormFields(Form, {})
  return (
    <>
      {/* <F.Title /> */}

      <F.dateFrom />

      <F.dateTo />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
