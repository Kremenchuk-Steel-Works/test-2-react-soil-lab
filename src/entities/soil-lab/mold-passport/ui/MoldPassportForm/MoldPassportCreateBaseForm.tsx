import { MoldCavityForm } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
import { moldCavityFormDefaultValues } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/schema'
import { MoldPassportCreateFormKit } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/FormKit'
import { type MoldPassportCreateFormFields } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { logger } from '@/shared/lib/logger'
import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/formKitContext'
import type { AsyncOptionsLoader, Option } from '@/shared/ui/select/ReactSelect'
import type { FormBaseProps } from '@/types/react-hook-form'

type Options = {
  loadMoldingAreas: AsyncOptionsLoader<Option>
  defaultMoldingAreas: Option[]
  loadPatternPlateFrames: AsyncOptionsLoader<Option>
  defaultPatternPlateFrames: Option[]
  loadMoldingFlasks: AsyncOptionsLoader<Option>
  defaultMoldingFlasks: Option[]
}

type MoldPassportCreateBaseFormFieldsProps = {
  options: Options
}

export type MoldPassportCreateBaseFormProps = FormBaseProps<
  MoldPassportCreateFormFields,
  MoldPassportDetailResponse
> &
  MoldPassportCreateBaseFormFieldsProps

const Form = MoldPassportCreateFormKit

export function MoldPassportCreateBaseForm({
  options,
  isSubmitting,
  responseData,
  submitBtnName,
}: MoldPassportCreateBaseFormProps) {
  logger.debug('[MoldPassportForm] FIELDS render')
  return (
    <>
      <FormKitProvider value={Form}>
        <h5 className="layout-text">Паспорт ливарної форми</h5>

        {/* <AlertMessage type={AlertType.WARNING} message={`Попередній стан форми: Не заповнено`} /> */}

        <Form.Controller name="moldingAreaId">
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={options.loadMoldingAreas}
              defaultOptions={options.defaultMoldingAreas}
              isVirtualized
              isClearable
              placeholder="Дільниця формовки"
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
              options={options.loadPatternPlateFrames}
              defaultOptions={options.defaultPatternPlateFrames}
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
              options={options.loadMoldingFlasks}
              defaultOptions={options.defaultMoldingFlasks}
              isVirtualized
              isClearable
              placeholder="Опока"
            />
          )}
        </Form.Controller>

        {/* DynamicFields */}
        <Form.WithError name={['dataGsc', 'dataAsc']}>
          <DynamicFieldArea section="castingTechnologyId" />
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

        <Form.Field name="notes">
          {({ register }) => <TextareaField label="Нотатка" {...register} />}
        </Form.Field>

        <Form.WithError name="root">
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {submitBtnName}
          </Button>
        </Form.WithError>
      </FormKitProvider>
    </>
  )
}
