import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import {
  measurementsGenerateReportFormSchema,
  type MeasurementsGenerateReportFormFields,
} from '@/features/soil-lab/measurements/generate-report/model/schema'
import { MeasurementsGenerateReportFormKit } from '@/features/soil-lab/measurements/generate-report/ui/formKit'
import { MeasurementsGenerateReportBaseForm } from '@/features/soil-lab/measurements/generate-report/ui/MeasurementsGenerateReportBaseForm'
import { parseApiError } from '@/shared/lib/axios/parseApiError'
import { createLogger } from '@/shared/lib/logger'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MeasurementsGenerateReportForm')

type FormFields = MeasurementsGenerateReportFormFields
const schema = measurementsGenerateReportFormSchema

type MeasurementsFormProps = FormProps<FormFields>

const Form = MeasurementsGenerateReportFormKit

export function MeasurementsGenerateReportForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: MeasurementsFormProps) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form
  // Submit
  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      const parsed = parseApiError(err)
      if (parsed.status === 404) {
        setError('root', { type: 'server', message: 'Немає даних для створення звіту' })
      } else {
        setError('root', { type: 'server', message: parsed.message })
      }
      logger.error('Ошибка при отправке формы:', 'err:', err, 'data:', data)
    }
  }

  return (
    <FormProvider {...form}>
      <FormLayout onSubmit={(e) => void handleSubmit(submitHandler)(e)}>
        <FormKitProvider value={Form}>
          <MeasurementsGenerateReportBaseForm
            responseData={responseData}
            isSubmitting={isSubmitting}
            submitBtnName={submitBtnName}
          />
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
