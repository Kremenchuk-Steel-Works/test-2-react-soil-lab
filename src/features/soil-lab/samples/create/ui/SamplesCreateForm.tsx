import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import {
  samplesCreateFormSchema,
  type SamplesCreateFormFields,
} from '@/features/soil-lab/samples/create/model/schema'
import { SamplesCreateFormKit } from '@/features/soil-lab/samples/create/ui/formKit'
import { SamplesCreateBaseForm } from '@/features/soil-lab/samples/create/ui/SamplesCreateBaseForm'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { createLogger } from '@/shared/lib/logger'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('SamplesCreateForm')

type FormFields = SamplesCreateFormFields
const schema = samplesCreateFormSchema

type SamplesFormProps = FormProps<FormFields, SampleDetailResponse>

const Form = SamplesCreateFormKit

export function SamplesCreateForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: SamplesFormProps) {
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
      data.receivedAt = new Date().toISOString()
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
          <SamplesCreateBaseForm
            responseData={responseData}
            isSubmitting={isSubmitting}
            submitBtnName={submitBtnName}
          />
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
