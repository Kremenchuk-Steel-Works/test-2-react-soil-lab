import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { AddressForm } from '@/entities/admin/address/forms/form'
import { ContactForm } from '@/entities/admin/contact/forms/form'
import { countryQueryKeys } from '@/entities/admin/country/services/keys'
import { countryService } from '@/entities/admin/country/services/service'
import type { CountryLookupResponse } from '@/entities/admin/country/types/response.dto'
import {
  organizationsSchema,
  type OrganizationsFormFields,
} from '@/entities/admin/organizations/forms/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DynamicFieldArray } from '@/shared/ui/forms/DynamicFieldArray'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = OrganizationsFormFields
const schema = organizationsSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function OrganizationsForm({ defaultValues, onSubmit, submitBtnName }: FormProps) {
  const {
    register,
    handleSubmit,
    control,
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
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Назва"
        {...register('legalName', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'legalName')}
      />

      <InputFieldWithError
        label="Номер реєстрації"
        {...register('registrationNumber', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'registrationNumber')}
      />

      <InputFieldWithError
        label="ІПН"
        {...register('taxId', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'taxId')}
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

      {/* Contacts */}
      <DynamicFieldArray
        title="Контактні дані"
        label="контактні дані"
        name="contacts"
        form={ContactForm}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Address */}
      <DynamicFieldArray
        title="Адреса"
        label="адресу"
        name="addresses"
        form={AddressForm}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Submit */}
      <ButtonWithError
        className="w-full"
        type="submit"
        errorMessage={errors.root?.message}
        disabled={isSubmitting}
      >
        {submitBtnName}
      </ButtonWithError>
    </form>
  )
}
