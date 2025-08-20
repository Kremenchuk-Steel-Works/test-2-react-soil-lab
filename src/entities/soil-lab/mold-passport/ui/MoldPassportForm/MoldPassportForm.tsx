import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { MoldCavityForm } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
import { moldCavityFormDefaultValues } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/schema'
import { moldPassportDynamicSections } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { MoldPassportFormKit } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/FormKit'
import {
  moldPassportFormSchema,
  type MoldPassportFormFields,
} from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import { moldingAreaService } from '@/entities/soil-lab/molding-area'
import { moldingFlaskService } from '@/entities/soil-lab/molding-flask/api/service'
import { patternPlateFrameService } from '@/entities/soil-lab/pattern-plate-frame/api/service'
import type {
  MoldingAreaLookupResponse,
  MoldingAreaLookupsListResponse,
  MoldingFlaskLookupResponse,
  MoldingFlaskLookupsListResponse,
  MoldPassportDetailResponse,
  PatternPlateFrameLookupResponse,
  PatternPlateFrameLookupsListResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MoldPassportForm')

type FormFields = MoldPassportFormFields
const schema = moldPassportFormSchema

type MoldPassportFormProps = FormProps<FormFields, MoldPassportDetailResponse>

const Form = MoldPassportFormKit

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
    handleSubmit,
    setError,
    formState: { isSubmitting },
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
      logger.error('Ошибка при отправке формы:', 'err:', err, 'data:', data)
    }
  }

  logger.debug('[MoldPassportForm] render', defaultValues)

  return (
    <>
      <FormProvider {...form}>
        <FormLayout onSubmit={handleSubmit(submitHandler)}>
          <DynamicFieldsProvider sections={moldPassportDynamicSections} responseData={responseData}>
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
                  placeholder="Ділянка формовки"
                />
              )}
            </Form.Controller>

            {/* DynamicFields */}
            <DynamicFieldArea section="moldingAreaId" showInactive />

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
              <DynamicFieldArea section="castingTechnologyId" showInactive />
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

            <Form.Field name="pressingPressure">
              {({ register }) => <InputField label="Тиск, од." {...register} />}
            </Form.Field>

            <Form.Field name="sequenceInShift">
              {({ register }) => (
                <InputField label="Порядковий номер форми за зміну" {...register} />
              )}
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

            <Form.Field name="notes">
              {({ register }) => <TextareaField label="Нотатка" {...register} />}
            </Form.Field>

            <Form.WithError name="root">
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {submitBtnName}
              </Button>
            </Form.WithError>
          </DynamicFieldsProvider>
        </FormLayout>
      </FormProvider>
      {/* <DevTool control={form.control} placement="bottom-left" /> */}
    </>
  )
}
