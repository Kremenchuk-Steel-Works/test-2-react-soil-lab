import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import type { TestMoistureResponse } from '@/entities/soil-lab/experiments/moisure/ui/form/fields'
import {
  moistureCreateFormSchema,
  type MoistureCreateFormFields,
} from '@/features/soil-lab/experiments/moisture/create/model/schema'
import { MoistureCreateFormKit } from '@/features/soil-lab/experiments/moisture/create/ui/formKit'
import { MoistureCreateBaseForm } from '@/features/soil-lab/experiments/moisture/create/ui/MoistureCreateBaseForm'
import { createLogger } from '@/shared/lib/logger'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MoistureCreateForm')

type FormFields = MoistureCreateFormFields
const schema = moistureCreateFormSchema

type MoistureFormProps = FormProps<FormFields, TestMoistureResponse>

const Form = MoistureCreateFormKit

export function MoistureCreateForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: MoistureFormProps) {
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
          <MoistureCreateBaseForm
            responseData={responseData}
            isSubmitting={isSubmitting}
            submitBtnName={submitBtnName}
          />
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
