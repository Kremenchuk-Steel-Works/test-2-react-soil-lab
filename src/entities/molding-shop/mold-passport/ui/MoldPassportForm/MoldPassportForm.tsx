import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { castingPatternService } from '@/entities/molding-shop/casting-pattern/api/service'
import { castingTechnologyService } from '@/entities/molding-shop/casting-technology/api/service'
import { coreBatchService } from '@/entities/molding-shop/core-batch/api/service'
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
import { moldingAreaService } from '@/entities/molding-shop/molding-area/api/service'
import { moldingFlaskService } from '@/entities/molding-shop/molding-flask/api/service'
import { patternPlateFrameService } from '@/entities/molding-shop/pattern-plate-frame/api/service'
import { resinService } from '@/entities/molding-shop/resin/api/service'
import type { CountryLookupResponse } from '@/shared/api/main-service/model'
import { useSelectOptions } from '@/shared/hooks/react-hook-form/options/useSelectOptions'
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
    castingTechnologies: castingTechnologyService.getLookup(),
    moldingAreas: moldingAreaService.getLookup(),
    patternPlateFrames: patternPlateFrameService.getLookup(),
    moldingFlasks: moldingFlaskService.getLookup(),
    resins: resinService.getLookup(),
    castingPatterns: castingPatternService.getLookup(),
    coreBatches: coreBatchService.getLookup(),
  })

  console.log(queriesData)

  // Options
  const castingTechnologiesOptions = useSelectOptions(
    queriesData?.castingTechnologies as CountryLookupResponse[] | undefined,
    {
      getValue: (c) => c.id,
      getLabel: (c) => c.name,
    },
  )

  const moldingAreasOptions = useSelectOptions(
    queriesData?.moldingAreas as CountryLookupResponse[] | undefined,
    {
      getValue: (c) => c.id,
      getLabel: (c) => c.name,
    },
  )

  const patternPlateFramesOptions = useSelectOptions(
    queriesData?.patternPlateFrames as CountryLookupResponse[] | undefined,
    {
      getValue: (c) => c.id,
      getLabel: (c) => c.name,
    },
  )

  const moldingFlasksOptions = useSelectOptions(
    queriesData?.moldingFlasks as CountryLookupResponse[] | undefined,
    {
      getValue: (c) => c.id,
      getLabel: (c) => c.name,
    },
  )

  const resinsOptions = useSelectOptions(
    queriesData?.resins as CountryLookupResponse[] | undefined,
    {
      getValue: (c) => c.id,
      getLabel: (c) => c.name,
    },
  )

  // Dynamic form options
  const dynamicFieldOptions: DynamicFieldOptions = {
    resinsOptions,
    castingTechnologiesOptions,
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

        {/* <AlertMessage type={AlertType.WARNING} message={`Попередній стан форми: Не заповнено`} /> */}

        <Controller
          name="moldingAreaId"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={moldingAreasOptions}
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
              options={patternPlateFramesOptions}
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
              options={moldingFlasksOptions}
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
          {...register('pressingPressure', formTransformers.number)}
          errorMessage={getNestedErrorMessage(errors, 'pressingPressure')}
        />

        <InputFieldWithError
          label="Порядковий номер форми за зміну"
          {...register('sequenceInShift', formTransformers.number)}
          errorMessage={getNestedErrorMessage(errors, 'sequenceInShift')}
        />

        <Controller
          name="assemblyTimestamp"
          control={control}
          render={({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="datetime"
              label="Дата та час складання півформ"
              errorMessage={getNestedErrorMessage(errors, 'assemblyTimestamp')}
            />
          )}
        />

        <CheckboxWithError
          label="Наявність дефектів"
          {...register(`isDefective`, formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, 'isDefective')}
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
