import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { countrySchema, type CountryFormFields } from '@/entities/admin/country/forms/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = CountryFormFields
const schema = countrySchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function CountryForm({ defaultValues, onSubmit, submitBtnName }: FormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      const error = err as Error
      setError('root', { message: error.message })
      logger.error(err)
    }
  }

  return (
    <FormLayout onSubmit={handleSubmit(submitHandler)}>
      <h5 className="layout-text">Країна</h5>

      <InputFieldWithError
        label="Назва"
        {...register('name', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'name')}
      />

      <InputFieldWithError
        label="Код 2"
        {...register('isoAlpha2', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'isoAlpha2')}
      />

      <InputFieldWithError
        label="Код 3"
        {...register('isoAlpha3', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'isoAlpha3')}
      />

      <InputFieldWithError
        label="Номер"
        {...register('isoNumeric', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'isoNumeric')}
      />

      <ButtonWithError
        className="w-full"
        type="submit"
        errorMessage={errors.root?.message}
        disabled={isSubmitting}
      >
        {submitBtnName}
      </ButtonWithError>
    </FormLayout>
  )
}
