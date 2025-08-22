import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
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
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsOld'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import { formTransformers } from '@/shared/lib/react-hook-form/nested-error'
import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldAreaOld'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContextOld'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MoldPassportForm')

type FormFields = MoldPassportFormFields
const schema = moldPassportFormSchema

const dynamicFieldConfig = moldPassportDynamicFieldConfig

type MoldPassportFormProps = FormProps<FormFields, MoldPassportDetailResponse>

const Form = createFormKit<FormFields>()

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
    getValues,
    resetField,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form
  const loadMoldingAreasOptions = useAsyncOptions<MoldingAreaLookupResponse, number>(
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

  const loadPatternPlateFramesOptions = useAsyncOptions<PatternPlateFrameLookupResponse, string>(
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

  const loadMoldingFlasksOptions = useAsyncOptions<MoldingFlaskLookupResponse, string>(
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
      logger.error('Ошибка при отправке формы:', 'err:', err, 'data:', data)
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
          <h5 className="layout-text">Паспорт ливарної форми</h5>

          {/* <AlertMessage type={AlertType.WARNING} message={`Попередній стан форми: Не заповнено`} /> */}

          <Form.Controller name="moldingAreaId">
            {({ field, fieldState }) => (
              <FormSelectField
                field={field}
                fieldState={fieldState}
                options={loadMoldingAreasOptions}
                defaultOptions={defaultMoldingAreasOptions}
                isVirtualized
                isClearable
                placeholder="Дільниця формовки"
              />
            )}
          </Form.Controller>

          {/* DynamicFields */}
          <DynamicFieldArea triggerFor="moldingAreaId" />

          <Form.Controller name="patternPlateFrameId">
            {({ field, fieldState }) => (
              <FormSelectField
                field={field}
                fieldState={fieldState}
                options={loadPatternPlateFramesOptions}
                defaultOptions={defaultPatternPlateFramesOptions}
                isVirtualized
                isClearable
                placeholder="Модельна рамка"
              />
            )}
          </Form.Controller>

          <Form.Controller name="moldingFlaskId">
            {({ field, fieldState }) => (
              <FormSelectField
                field={field}
                fieldState={fieldState}
                options={loadMoldingFlasksOptions}
                defaultOptions={defaultMoldingFlasksOptions}
                isVirtualized
                isClearable
                placeholder="Опока"
              />
            )}
          </Form.Controller>

          {/* DynamicFields */}
          <Form.WithError name={['dataGsc', 'dataAsc']}>
            <DynamicFieldArea triggerFor="castingTechnologyId" />
          </Form.WithError>

          {/* Cavities */}
          <Form.WithError name="moldCavities">
            <DynamicFieldArray
              title="Відбиток деталі у формі"
              label="відбиток деталі у формі"
              name="moldCavities"
              form={MoldCavityForm}
              defaultItem={moldCavityFormDefaultValues}
              itemsData={responseData?.moldCavities}
            />
          </Form.WithError>

          <Form.Field name="pressingPressure" registerOptions={formTransformers.number}>
            {({ register }) => <InputField label="Тиск, од." {...register} />}
          </Form.Field>

          <Form.Field name="sequenceInShift" registerOptions={formTransformers.number}>
            {({ register }) => <InputField label="Порядковий номер форми за зміну" {...register} />}
          </Form.Field>

          <Form.Controller name="assemblyTimestamp">
            {({ field, fieldState }) => (
              <FormDateTimeField
                field={field}
                fieldState={fieldState}
                type="datetime"
                label="Дата та час складання півформ"
              />
            )}
          </Form.Controller>

          <Form.Field name="isDefective">
            {({ register }) => <Checkbox label="Наявність дефектів" {...register} />}
          </Form.Field>

          <Form.Field name="notes" registerOptions={formTransformers.string}>
            {({ register }) => <TextareaField label="Нотатка" {...register} />}
          </Form.Field>

          <Form.WithError name="root">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {submitBtnName}
            </Button>
          </Form.WithError>
        </FormLayout>
      </DynamicFieldsProvider>
    </FormProvider>
  )
}
