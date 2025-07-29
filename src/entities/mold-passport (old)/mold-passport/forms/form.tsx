import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { AddressForm } from '@/entities/admin/address/forms/form'
import { ContactForm } from '@/entities/admin/contact/forms/form'
import { EmployeeProfileForm } from '@/entities/admin/employeeProfile/forms/form'
import { organizationQueryKeys } from '@/entities/admin/organizations/services/keys'
import { organizationService } from '@/entities/admin/organizations/services/service'
import { organizationMockService } from '@/entities/admin/organizations/services/service.mock'
import type { OrganizationLookupResponse } from '@/entities/admin/organizations/types/response.dto'
import { personQueryKeys } from '@/entities/admin/people/services/keys'
import { peopleMockService } from '@/entities/admin/people/services/service.mock'
import { genderOptions } from '@/entities/admin/people/types/gender'
import { positionQueryKeys } from '@/entities/admin/positions/services/keys'
import { positionService } from '@/entities/admin/positions/services/service'
import {
  moldPassportDynamicFieldConfigOld,
  type MoldPassportDynamicFieldOptionsOld,
} from '@/entities/mold-passport (old)/mold-passport/forms/configs/dynamic-fields'
import {
  moldPassportSchemaOld,
  type MoldPassportFormFieldsOld,
} from '@/entities/mold-passport (old)/mold-passport/forms/schema'
import { useAsyncValidators } from '@/shared/hooks/react-hook-form/async-validation/useAsyncValidators'
import { useAsyncOptionsLoader } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsLoader'
import { useParallelQueries } from '@/shared/hooks/react-query/useParallelQueries'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import { DynamicFieldArrayOld } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArrayOld'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { OptionalField } from '@/shared/ui/react-hook-form/dynamic-fields/OptionalField'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormFileUpload from '@/shared/ui/react-hook-form/fields/FormFileUpload'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
import type { FormInitialData, FormProps } from '@/types/react-hook-form'

type FormFields = MoldPassportFormFieldsOld
const schema = moldPassportSchemaOld

const dynamicFieldConfig = moldPassportDynamicFieldConfigOld
type DynamicFieldOptions = MoldPassportDynamicFieldOptionsOld

interface MoldPassportFormOptions {
  organizations: Option<string>[]
}

export type MoldPassportFormInitialDataOld = FormInitialData<FormFields, MoldPassportFormOptions>

export default function MoldPassportFormOld({
  initialData,
  onSubmit,
  submitBtnName,
}: FormProps<FormFields, MoldPassportFormOptions>) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: initialData?.defaultValues,
  })

  const {
    control,
    register,
    resetField,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = form

  // Async validations
  const asyncValidatorsConfig = useMemo(
    () => ({
      lastName: {
        validationFn: peopleMockService.isUsernameAvailable,
        queryKeyFn: personQueryKeys.uniqueness,
        errorMessage: 'Це прізвище вже використовується',
      },
    }),
    [],
  )

  const { isAsyncValidating, hasAsyncErrors, asyncCheckingFields, AsyncValidatorsComponent } =
    useAsyncValidators<FormFields>({
      config: asyncValidatorsConfig,
    })

  // Queries
  const {
    data: queriesData,
    isLoading: isQueriesLoading,
    error: queriesError,
  } = useParallelQueries({
    organizations: {
      queryKey: organizationQueryKeys.lookups(),
      queryFn: () => organizationService.getLookup(),
    },
    positions: {
      queryKey: positionQueryKeys.lookups(),
      queryFn: () => positionService.getLookup(),
    },
  })

  // Options
  const organizationsOptions: Option<string>[] = useMemo(
    () =>
      queriesData.organizations?.map((c) => ({
        value: c.id,
        label: c.legalName,
      })) || [],
    [queriesData.organizations],
  )

  const positionsOptions: Option<string>[] = useMemo(
    () =>
      queriesData.positions?.map((c) => ({
        value: c.id,
        label: c.name,
      })) || [],
    [queriesData.positions],
  )

  // Async options
  const loadAsyncOrganizationOptions = useAsyncOptionsLoader<OrganizationLookupResponse, string>(
    organizationMockService.getPaginatedLookup,
    {
      value: 'id',
      label: 'legalName',
    },
  )

  // Dynamic form options
  const dynamicFieldOptions: DynamicFieldOptions = {
    organizationsOptions,
    positionsOptions,
    loadAsyncOrganizationOptions,
  }

  // Зависящие опции
  // const dependentOptionsConfig = useMemo(
  //   () =>
  //     moldPassportDependentOptionsConfig({
  //       organizationsOptions,
  //       positionsOptions,
  //       loadAsyncOrganizationOptions,
  //     }),
  //   [organizationsOptions, positionsOptions],
  // )

  // const {
  //   options: testOptions,
  //   isDisabled: isTestDisabled,
  //   placeholder: testPlaceholder,
  // } = useDependentOptions({
  //   control,
  //   resetField,
  //   dependentFieldName: 'test',
  //   config: dependentOptionsConfig,
  // })

  // Loading || Error
  if (isQueriesLoading) return
  if (queriesError) {
    return <AlertMessage type={AlertType.ERROR} message={queriesError.message} />
  }

  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    // Async validations
    if (hasAsyncErrors) return

    // Submit
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      const error = err as Error
      setError('root', { message: error.message })
      logger.error('Ошибка при отправке формы:', err, data)
    }
  }

  return (
    // FormProvider for async validators
    <FormProvider {...form}>
      <DynamicFieldsProvider
        control={control}
        getValues={getValues}
        resetField={resetField}
        errors={errors}
        config={dynamicFieldConfig}
        options={dynamicFieldOptions}
      >
        <FormLayout onSubmit={handleSubmit(submitHandler)}>
          <h4 className="layout-text">Паспорт ливарної форми</h4>

          {/* Async validators */}
          <AsyncValidatorsComponent />

          <InputFieldWithError
            label="Ім'я"
            isLoading={asyncCheckingFields.firstName}
            {...register('firstName', formTransformers.string)}
            errorMessage={getNestedErrorMessage(errors, 'firstName')}
          />

          {/* DynamicFields */}
          <DynamicFieldArea triggerFor="firstName" />

          <InputFieldWithError
            label="Прізвище"
            isLoading={asyncCheckingFields.lastName}
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
                placeholder="Оберіть стать"
                errorMessage={getNestedErrorMessage(errors, 'gender')}
              />
            )}
          />

          {/* Dependent options */}
          {/* <Controller
          name="test"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={testOptions}
              isDisabled={isTestDisabled}
              isVirtualized
              isMulti
              isClearable
              placeholder={testPlaceholder}
              errorMessage={getNestedErrorMessage(errors, 'test')}
            />
          )}
        /> */}

          {/* <Controller
          name="test"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={testOptions}
              defaultOptions={initialData?.options?.organizations}
              isDisabled={isTestDisabled}
              isClearable={false}
              isMulti
              placeholder={testPlaceholder}
              errorMessage={getNestedErrorMessage(errors, 'test')}
            />
          )}
        /> */}

          {/* Dynamic fields */}
          <DynamicFieldArea triggerFor="gender" />

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
              defaultOptions={initialData.options.organizations}
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
            disabled={isSubmitting || isAsyncValidating}
          >
            {submitBtnName}
          </ButtonWithError>
        </FormLayout>
      </DynamicFieldsProvider>
    </FormProvider>
  )
}
