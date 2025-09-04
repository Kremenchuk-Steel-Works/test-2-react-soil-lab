import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import {
  moldPassportDynamicSections,
  useMoldPassportFormOptions,
} from '@/entities/molding-shop-update/mold-passport'
import {
  moldPassportCreateFormSchema,
  type MoldPassportCreateFormFields,
} from '@/features/molding-shop-update/mold-passport/create/model/schema'
import { MoldPassportCreateFormKit } from '@/features/molding-shop-update/mold-passport/create/ui/formKit'
import { MoldPassportCreateBaseForm } from '@/features/molding-shop-update/mold-passport/create/ui/MoldPassportCreateBaseForm'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { createLogger } from '@/shared/lib/logger'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MoldPassportForm')

type FormFields = MoldPassportCreateFormFields
const schema = moldPassportCreateFormSchema

type MoldPassportFormProps = FormProps<FormFields, MoldPassportDetailResponse>

const Form = MoldPassportCreateFormKit

export function MoldPassportCreateForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: MoldPassportFormProps) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form

  // Options
  const options = useMoldPassportFormOptions(responseData)

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

  logger.debug('[MoldPassportForm] render', 'defaultValues', defaultValues)

  return (
    <FormProvider {...form}>
      <FormLayout onSubmit={(e) => void handleSubmit(submitHandler)(e)}>
        <FormKitProvider value={Form}>
          <DynamicFieldsProvider sections={moldPassportDynamicSections} responseData={responseData}>
            <MoldPassportCreateBaseForm
              responseData={responseData}
              options={options}
              isSubmitting={isSubmitting}
              submitBtnName={submitBtnName}
            />
          </DynamicFieldsProvider>
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
