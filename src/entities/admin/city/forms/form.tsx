import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { citySchema, type CityFormFields } from '@/entities/admin/city/forms/schema'
import { countryQueryKeys } from '@/entities/admin/country/services/keys'
import { countryService } from '@/entities/admin/country/services/service'
import type { CountryLookupResponse } from '@/entities/admin/country/types/response.dto'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { FormLayout } from '@/shared/ui/forms/FormLayout'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = CityFormFields
const schema = citySchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function CityForm({ defaultValues, onSubmit, submitBtnName }: FormProps) {
  const {
    control,
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

  // Query
  const {
    data: countriesData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CountryLookupResponse[], Error>({
    queryKey: countryQueryKeys.lookups(),
    queryFn: () => countryService.getLookup(),
  })

  // Loading || Error
  if (isLoading) return
  if (isError) {
    return <AlertMessage type={AlertType.ERROR} message={queryError.message} />
  }

  // Options
  const countriesOptions: Option[] =
    countriesData?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  return (
    <FormLayout onSubmit={handleSubmit(submitHandler)}>
      <h4 className="layout-text">Місто</h4>

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

      <Controller
        name="countryId"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={countriesOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть країну"
            errorMessage={getNestedErrorMessage(errors, 'countryId')}
          />
        )}
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
