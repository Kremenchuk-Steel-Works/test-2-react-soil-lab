import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { addressOptions } from '@/entities/admin/address/types/address'
import { organizationQueryKeys } from '@/entities/admin/organizations/services/keys'
import { organizationService } from '@/entities/admin/organizations/services/service'
import { genderOptions } from '@/entities/admin/people/types/gender'
import { positionQueryKeys } from '@/entities/admin/positions/services/keys'
import { positionService } from '@/entities/admin/positions/services/service'
import { MoldCavityForm } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
import { moldCavityFormDefaultValues } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import {
  moldPassportDynamicFieldConfig,
  type MoldPassportDynamicFieldOptions,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import {
  moldPassportFormSchema,
  type MoldPassportFormFields,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/schema'
import { useParallelQueries } from '@/shared/hooks/react-query/useParallelQueries'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { Option } from '@/shared/ui/select/ReactSelect'
import {
  ButtonWithError,
  CheckboxWithError,
  InputFieldWithError,
  TextAreaFieldWithError,
} from '@/shared/ui/with-error/fieldsWithError'
import type { FormInitialData, FormProps } from '@/types/react-hook-form'

type FormFields = MoldPassportFormFields
const schema = moldPassportFormSchema

const dynamicFieldConfig = moldPassportDynamicFieldConfig
type DynamicFieldOptions = MoldPassportDynamicFieldOptions

type MoldPassportFormOptions = {}
type FormOptions = MoldPassportFormOptions

export type MoldPassportFormInitialData = FormInitialData<FormFields, FormOptions>

export default function MoldPassportForm({
  initialData,
  onSubmit,
  submitBtnName,
}: FormProps<FormFields, FormOptions>) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: initialData?.defaultValues,
  })

  const {
    control,
    register,
    getValues,
    resetField,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form

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

  // Dynamic form options
  const dynamicFieldOptions: DynamicFieldOptions = {
    organizationsOptions,
    positionsOptions,
    addressOptions,
    genderOptions,
  }

  // Loading || Error
  if (isQueriesLoading) return
  if (queriesError) {
    return <AlertMessage type={AlertType.ERROR} message={queriesError.message} />
  }

  const submitHandler: SubmitHandler<FormFields> = async (data) => {
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

        <AlertMessage type={AlertType.WARNING} message={`Попередній стан форми: Не заповнено`} />

        <Controller
          name="moldingAreaId"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={genderOptions}
              isVirtualized
              isClearable
              placeholder="Ділянка формовки"
              errorMessage={getNestedErrorMessage(errors, 'moldingAreaId')}
            />
          )}
        />

        {/* DynamicFields */}
        <DynamicFieldArea triggerFor="moldingAreaId" />

        <Controller
          name="patternPlateFrameId"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={organizationsOptions}
              isVirtualized
              isClearable
              placeholder="Модельна рамка"
              errorMessage={getNestedErrorMessage(errors, 'patternPlateFrameId')}
            />
          )}
        />

        <Controller
          name="moldingFlaskId"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={organizationsOptions}
              isVirtualized
              isClearable
              placeholder="Опока"
              errorMessage={getNestedErrorMessage(errors, 'moldingFlaskId')}
            />
          )}
        />

        {/* DynamicFields */}
        <DynamicFieldArea triggerFor="castingTechnologyId" />

        <Controller
          name="markingYear"
          control={control}
          render={({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="year"
              yearOffsetPast={2}
              yearOffsetFuture={2}
              label="Рік маркування відбитків"
              errorMessage={getNestedErrorMessage(errors, 'markingYear')}
            />
          )}
        />

        {/* Cavities */}
        <DynamicFieldArray
          title="Відбиток деталі у формі"
          label="відбиток деталі у формі"
          name="moldCavities"
          form={MoldCavityForm}
          defaultItem={moldCavityFormDefaultValues}
          control={control}
          register={register}
          errors={errors}
        />

        <InputFieldWithError
          label="Тиск, од."
          {...register('pressingPressure', formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, 'pressingPressure')}
        />

        <InputFieldWithError
          label="Порядковий номер форми за зміну"
          {...register('moldSequenceInShift', formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, 'moldSequenceInShift')}
        />

        <Controller
          name="moldAssemblyTimestamp"
          control={control}
          render={({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="datetime"
              label="Час складання півформ"
              errorMessage={getNestedErrorMessage(errors, 'moldAssemblyTimestamp')}
            />
          )}
        />

        <Controller
          name="experimentIds"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={organizationsOptions}
              isMulti
              isVirtualized
              isClearable
              placeholder="Експеримент"
              errorMessage={getNestedErrorMessage(errors, 'experimentIds')}
            />
          )}
        />

        <CheckboxWithError
          label="Форма справна"
          {...register(`status`, formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, 'status')}
        />

        <TextAreaFieldWithError
          label="Нотатка"
          {...register('notes', formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, 'notes')}
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
    </DynamicFieldsProvider>
  )
}
