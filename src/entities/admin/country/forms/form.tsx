import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { countrySchema, type CountryFormFields } from '@/entities/admin/country/forms/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { FormLayout } from '@/shared/ui/forms/FormLayout'
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
      <h4 className="layout-text">Країна</h4>

      <InputFieldWithError
        label="Назва"
        {...register('name', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'name')}
      />

      <InputFieldWithError
        label="Локальна назва"
        {...register('nameLocal', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'nameLocal')}
      />

      <InputFieldWithError
        label="Код 2"
        {...register('code', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'code')}
      />

      <InputFieldWithError
        label="Код 3"
        {...register('code3', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'code3')}
      />

      <InputFieldWithError
        label="Номер"
        {...register('numericCode', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'numericCode')}
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
