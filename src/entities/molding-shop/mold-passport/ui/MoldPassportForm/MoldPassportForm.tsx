import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { MoldCavityForm } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
import { moldCavityFormDefaultValues } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import { moldPassportDynamicFieldConfig } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import {
  moldPassportFormSchema,
  type MoldPassportFormFields,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/schema'
import { moldingAreaService } from '@/entities/molding-shop/molding-area'
import { moldingFlaskService } from '@/entities/molding-shop/molding-flask/api/service'
import { patternPlateFrameService } from '@/entities/molding-shop/pattern-plate-frame/api/service'
import type {
  MoldingAreaLookupResponse,
  MoldingAreaLookupsListResponse,
  MoldingFlaskLookupResponse,
  MoldingFlaskLookupsListResponse,
  MoldPassportDetailResponse,
  PatternPlateFrameLookupResponse,
  PatternPlateFrameLookupsListResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsNew'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
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
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MoldPassportForm')

type FormFields = MoldPassportFormFields
const schema = moldPassportFormSchema

const dynamicFieldConfig = moldPassportDynamicFieldConfig

type MoldPassportFormProps = FormProps<FormFields, MoldPassportDetailResponse>

export function MoldPassportForm({
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
    control,
    register,
    getValues,
    resetField,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form
  const loadMoldingAreasOptions = useAsyncOptionsNew<MoldingAreaLookupResponse, number>(
    moldingAreaService.getLookup,
    {
      paramsBuilder: (search, page) => ({
        search,
        page,
        pageSize: 20,
      }),
      responseAdapter: (data: MoldingAreaLookupsListResponse) => ({
        items: data.data,
        hasMore: data.data.length < data.totalItems,
      }),
      mapper: (item) => ({
        value: item.id,
        label: item.name,
      }),
    },
  )

  const defaultMoldingAreasOptions = useDefaultOption(responseData?.moldingArea, (data) => ({
    value: data.id,
    label: data.name,
  }))

  const loadPatternPlateFramesOptions = useAsyncOptionsNew<PatternPlateFrameLookupResponse, string>(
    patternPlateFrameService.getLookup,
    {
      paramsBuilder: (search, page) => ({
        search,
        page,
        pageSize: 20,
      }),
      responseAdapter: (data: PatternPlateFrameLookupsListResponse) => ({
        items: data.data,
        hasMore: data.data.length < data.totalItems,
      }),
      mapper: (item) => ({
        value: item.id,
        label: item.serialNumber,
      }),
    },
  )

  const defaultPatternPlateFramesOptions = useDefaultOption(
    responseData?.patternPlateFrame,
    (data) => ({
      value: data.id,
      label: data.serialNumber,
    }),
  )

  const loadMoldingFlasksOptions = useAsyncOptionsNew<MoldingFlaskLookupResponse, string>(
    moldingFlaskService.getLookup,
    {
      paramsBuilder: (search, page) => ({
        search,
        page,
        pageSize: 20,
      }),
      responseAdapter: (data: MoldingFlaskLookupsListResponse) => ({
        items: data.data,
        hasMore: data.data.length < data.totalItems,
      }),
      mapper: (item) => ({
        value: item.id,
        label: item.serialNumber,
      }),
    },
  )

  const defaultMoldingFlasksOptions = useDefaultOption(responseData?.moldingFlask, (data) => ({
    value: data.id,
    label: data.serialNumber,
  }))

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

  logger.debug('[MoldPassportForm] render', defaultValues)

  return (
    <FormProvider {...form}>
      <DynamicFieldsProvider
        control={control}
        getValues={getValues}
        resetField={resetField}
        config={dynamicFieldConfig}
        responseData={responseData}
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
                options={loadMoldingAreasOptions}
                defaultOptions={defaultMoldingAreasOptions}
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
                options={loadPatternPlateFramesOptions}
                defaultOptions={defaultPatternPlateFramesOptions}
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
                options={loadMoldingFlasksOptions}
                defaultOptions={defaultMoldingFlasksOptions}
                isVirtualized
                isClearable
                placeholder="Опока"
                errorMessage={getNestedErrorMessage(errors, 'moldingFlaskId')}
              />
            )}
          />

          {/* DynamicFields */}
          <DynamicFieldArea triggerFor="castingTechnologyId" />

          {/* Cavities */}
          <DynamicFieldArray
            title="Відбиток деталі у формі"
            label="відбиток деталі у формі"
            name="moldCavities"
            form={MoldCavityForm}
            defaultItem={moldCavityFormDefaultValues}
            itemsData={responseData?.moldCavities}
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
    </FormProvider>
  )
}
