import { zodResolver } from '@hookform/resolvers/zod'
import { useQueries, type UseQueryResult } from '@tanstack/react-query'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { AddressForm } from '@/entities/admin/address/forms/form'
import { ContactForm } from '@/entities/admin/contact/forms/form'
import { EmployeeProfileForm } from '@/entities/admin/employeeProfile/forms/form'
import { organizationQueryKeys } from '@/entities/admin/organizations/services/keys'
import { organizationService } from '@/entities/admin/organizations/services/service'
import type { OrganizationLookupResponse } from '@/entities/admin/organizations/types/response.dto'
import { peopleSchema, type PeopleFormFields } from '@/entities/admin/people/forms/schema'
import { genderOptions } from '@/entities/admin/people/types/gender'
import { positionQueryKeys } from '@/entities/admin/positions/services/keys'
import { positionService } from '@/entities/admin/positions/services/service'
import type { PositionLookupResponse } from '@/entities/admin/positions/types/response.dto'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DynamicFieldArrayOld } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArrayOld'
import { OptionalField } from '@/shared/ui/react-hook-form/dynamic-fields/OptionalField'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormFileUpload from '@/shared/ui/react-hook-form/fields/FormFileUpload'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = PeopleFormFields
const schema = peopleSchema

export interface PeopleFormInitialData {
  defaultValues?: Partial<FormFields>
  options?: {
    organizations?: Option<string>[]
  }
}

interface FormProps {
  initialData?: PeopleFormInitialData
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function PeopleForm({ initialData, onSubmit, submitBtnName }: FormProps) {
  const { defaultValues = {} } = initialData || {}
  // const { defaultValues = {}, options = {} } = initialData || {}
  const {
    control,
    register,
    resetField,
    handleSubmit,
    setError,
    setValue,
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
      logger.error(err, data)
    }
  }

  // Queries
  const queries = useQueries({
    queries: [
      {
        queryKey: organizationQueryKeys.lookups(),
        queryFn: () => organizationService.getLookup(),
      },
      {
        queryKey: positionQueryKeys.lookups(),
        queryFn: () => positionService.getLookup(),
      },
    ],
  })

  // Loading || Error
  const isAnyLoading = queries.some((q) => q.isLoading)
  const isAnyError = queries.some((q) => q.isError)
  const firstError = queries.find((q) => q.error)?.error

  if (isAnyLoading) return
  if (isAnyError && firstError instanceof Error) {
    return <AlertMessage type={AlertType.ERROR} message={firstError.message} />
  }

  // Queries data
  const [organizationsQ, positionsQ] = queries as [
    UseQueryResult<OrganizationLookupResponse[], Error>,
    UseQueryResult<PositionLookupResponse[], Error>,
  ]

  // Options
  const organizationsOptions: Option<string>[] =
    organizationsQ.data?.map((c) => ({
      value: c.id,
      label: c.legalName,
    })) || []

  const positionsOptions: Option<string>[] =
    positionsQ.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  // // Загрузчик для организаций
  // const loadAsyncOrganizationOptions = useAsyncOptionsLoader(organizationMockService, {
  //   value: 'id',
  //   label: 'legalName',
  // })

  return (
    <FormLayout onSubmit={handleSubmit(submitHandler)}>
      <h5 className="layout-text">Людина</h5>

      <InputFieldWithError
        label="Ім'я"
        {...register('firstName', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'firstName')}
      />

      <InputFieldWithError
        label="Прізвище"
        {...register('lastName', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'lastName')}
      />

      <InputFieldWithError
        label="По батькові"
        {...register('middleName', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'middleName')}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={genderOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть стать"
            errorMessage={getNestedErrorMessage(errors, 'gender')}
          />
        )}
      />

      <Controller
        name="birthDate"
        control={control}
        render={({ field, fieldState }) => (
          <FormDateTimeField
            field={field}
            fieldState={fieldState}
            label="Дата народження"
            errorMessage={getNestedErrorMessage(errors, 'birthDate')}
          />
        )}
      />

      <Controller
        name="photoUrl"
        control={control}
        render={({ field, fieldState }) => (
          <FormFileUpload
            field={field}
            fieldState={fieldState}
            label="Фото профілю"
            fileType="image"
            errorMessage={getNestedErrorMessage(errors, 'photoUrl')}
          />
        )}
      />

      {/* Contacts */}
      <DynamicFieldArrayOld
        title="Контактні дані"
        label="контактні дані"
        name="contacts"
        form={ContactForm}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Address */}
      <DynamicFieldArrayOld
        title="Адреса"
        label="адресу"
        name="addresses"
        form={AddressForm}
        control={control}
        register={register}
        errors={errors}
      />

      <Controller
        name="organizationIds"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={organizationsOptions}
            isVirtualized
            isMulti
            isClearable
            placeholder="Оберіть організацію"
            errorMessage={getNestedErrorMessage(errors, 'organizationIds')}
          />
        )}
      />

      {/* <Controller
        name="organizationIds"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            loadOptions={loadAsyncOrganizationOptions}
            defaultOptions={options.organizations}
            isMulti
            isClearable
            isAsyncPaginate
            isVirtualized
            placeholder="Оберіть організацію 2"
            errorMessage={getNestedErrorMessage(errors, 'organizationIds')}
          />
        )}
      /> */}

      <Controller
        name="positionIds"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={positionsOptions}
            isVirtualized
            isMulti
            isClearable
            placeholder="Оберіть посаду"
            errorMessage={getNestedErrorMessage(errors, 'positionIds')}
          />
        )}
      />

      <OptionalField
        title="Профіль працівника"
        label="профіль працівника"
        name="employeeProfile"
        form={EmployeeProfileForm}
        control={control}
        register={register}
        errors={errors}
        resetField={resetField}
        setValue={setValue}
        defaultItem={{}}
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
