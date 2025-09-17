import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import type { TestStrengthResponse } from '@/entities/soil-lab/experiments/strength/ui/form/fields'
import { experimentsStrengthDynamicSections } from '@/entities/soil-lab/experiments/strength/ui/form/lib/dynamic-sections'
import {
  strengthCreateFormSchema,
  type StrengthCreateFormFields,
} from '@/features/soil-lab/experiments/strength/create/model/schema'
import { StrengthCreateFormKit } from '@/features/soil-lab/experiments/strength/create/ui/formKit'
import { StrengthCreateBaseForm } from '@/features/soil-lab/experiments/strength/create/ui/StrengthCreateBaseForm'
import { createLogger } from '@/shared/lib/logger'
import { createDynamicEngine } from '@/shared/lib/zod/dynamic-resolver'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('StrengthCreateForm')

type FormFields = StrengthCreateFormFields
const schema = strengthCreateFormSchema

type StrengthFormProps = FormProps<FormFields, TestStrengthResponse>

const Form = StrengthCreateFormKit

export function StrengthCreateForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: StrengthFormProps) {
  const { resolver, valueNormalizer } = createDynamicEngine<FormFields>(
    schema,
    experimentsStrengthDynamicSections,
  )

  const form = useForm<FormFields>({
    resolver,
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
          <DynamicFieldsProvider
            sections={experimentsStrengthDynamicSections}
            responseData={responseData}
            valueNormalizer={valueNormalizer}
          >
            <StrengthCreateBaseForm
              responseData={responseData}
              isSubmitting={isSubmitting}
              submitBtnName={submitBtnName}
            />
          </DynamicFieldsProvider>
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
