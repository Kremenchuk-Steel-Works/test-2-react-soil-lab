import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import {
  measurementsCreateFormSchema,
  type MeasurementsCreateFormFields,
} from '@/features/soil-lab/measurements/create/model/schema'
import { MeasurementsCreateFormKit } from '@/features/soil-lab/measurements/create/ui/formKit'
import { MeasurementsCreateBaseForm } from '@/features/soil-lab/measurements/create/ui/MeasurementsCreateBaseForm'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { createLogger } from '@/shared/lib/logger'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MeasurementsCreateForm')

type FormFields = MeasurementsCreateFormFields
const schema = measurementsCreateFormSchema

type MeasurementsFormProps = FormProps<FormFields, MoldPassportDetailResponse>

const Form = MeasurementsCreateFormKit

export function MeasurementsCreateForm({
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
          <MeasurementsCreateBaseForm
            responseData={responseData}
            isSubmitting={isSubmitting}
            submitBtnName={submitBtnName}
          />
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
