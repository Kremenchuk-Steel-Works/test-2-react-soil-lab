import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import type { TestGasPermeabilityResponse } from '@/entities/soil-lab/experiments/gasPermeability/ui/form/fields'
import { experimentsGasPermeabilityDynamicSections } from '@/entities/soil-lab/experiments/gasPermeability/ui/form/lib/dynamic-sections'
import {
  gasPermeabilityCreateFormSchema,
  type GasPermeabilityCreateFormFields,
} from '@/features/soil-lab/experiments/gasPermeability/create/model/schema'
import { GasPermeabilityCreateFormKit } from '@/features/soil-lab/experiments/gasPermeability/create/ui/formKit'
import { GasPermeabilityCreateBaseForm } from '@/features/soil-lab/experiments/gasPermeability/create/ui/GasPermeabilityCreateBaseForm'
import { createLogger } from '@/shared/lib/logger'
import { createDynamicEngine } from '@/shared/lib/zod/dynamic-resolver'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('GasPermeabilityCreateForm')

type FormFields = GasPermeabilityCreateFormFields
const schema = gasPermeabilityCreateFormSchema

type GasPermeabilityFormProps = FormProps<FormFields, TestGasPermeabilityResponse>

const Form = GasPermeabilityCreateFormKit

export function GasPermeabilityCreateForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: GasPermeabilityFormProps) {
  const { resolver, valueNormalizer } = createDynamicEngine<FormFields>(
    schema,
    experimentsGasPermeabilityDynamicSections,
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
            sections={experimentsGasPermeabilityDynamicSections}
            responseData={responseData}
            valueNormalizer={valueNormalizer}
          >
            <GasPermeabilityCreateBaseForm
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
