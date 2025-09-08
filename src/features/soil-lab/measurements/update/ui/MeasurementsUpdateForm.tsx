import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import {
  measurementsUpdateFormSchema,
  type MeasurementsUpdateFormFields,
} from '@/features/soil-lab/measurements/update/model/schema'
import { MeasurementsUpdateFormKit } from '@/features/soil-lab/measurements/update/ui/formKit'
import { MeasurementsUpdateBaseForm } from '@/features/soil-lab/measurements/update/ui/MeasurementsUpdateBaseForm'
import type { MeasurementDetailResponse } from '@/shared/api/soil-lab/model'
import { createLogger } from '@/shared/lib/logger'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MeasurementsUpdateForm')

type FormFields = MeasurementsUpdateFormFields
const schema = measurementsUpdateFormSchema

type MeasurementsFormProps = FormProps<FormFields, MeasurementDetailResponse>

const Form = MeasurementsUpdateFormKit

export function MeasurementsUpdateForm({
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
      const error = err as Error
      setError('root', { message: error.message })
      logger.error('Ошибка при отправке формы:', 'err:', err, 'data:', data)
    }
  }

  return (
    <FormProvider {...form}>
      <FormLayout onSubmit={(e) => void handleSubmit(submitHandler)(e)}>
        <FormKitProvider value={Form}>
          <MeasurementsUpdateBaseForm
            responseData={responseData}
            isSubmitting={isSubmitting}
            submitBtnName={submitBtnName}
          />
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
