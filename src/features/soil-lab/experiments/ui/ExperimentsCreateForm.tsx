import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import type { TestExperimentsResponse } from '@/entities/soil-lab/experiments/ui/form/fields'
import { experimentsDynamicSections } from '@/entities/soil-lab/experiments/ui/form/lib/dynamic-sections'
import {
  experimentsCreateFormSchema,
  type ExperimentsCreateFormFields,
} from '@/features/soil-lab/experiments/model/schema'
import { ExperimentsCreateBaseForm } from '@/features/soil-lab/experiments/ui/ExperimentsCreateBaseForm'
import { ExperimentsCreateFormKit } from '@/features/soil-lab/experiments/ui/formKit'
import { createLogger } from '@/shared/lib/logger'
import { createDynamicEngine } from '@/shared/lib/zod/dynamic-resolver'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('ExperimentsCreateForm')

type FormFields = ExperimentsCreateFormFields
const schema = experimentsCreateFormSchema

type ExperimentsFormProps = FormProps<FormFields, TestExperimentsResponse>

const Form = ExperimentsCreateFormKit

export function ExperimentsCreateForm({
  defaultValues,
  responseData,
  onSubmit,
}: ExperimentsFormProps) {
  const { resolver, valueNormalizer } = createDynamicEngine<FormFields>(
    schema,
    experimentsDynamicSections,
  )

  const form = useForm<FormFields>({
    resolver,
    defaultValues,
  })
  const { handleSubmit, setError } = form
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
            sections={experimentsDynamicSections}
            responseData={responseData}
            valueNormalizer={valueNormalizer}
          >
            <ExperimentsCreateBaseForm responseData={responseData} />
          </DynamicFieldsProvider>
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
