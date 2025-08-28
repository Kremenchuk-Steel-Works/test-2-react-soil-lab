import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { MoldCavityForm } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
import { moldCavityFormDefaultValues } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/schema'
import type { MoldPassportFormOptions } from '@/entities/soil-lab/mold-passport/hooks/useMoldPassportFormOptions'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Options = Pick<
  MoldPassportFormOptions,
  | 'loadMoldingAreas'
  | 'defaultMoldingAreas'
  | 'loadPatternPlateFrames'
  | 'defaultPatternPlateFrames'
  | 'loadMoldingFlasks'
  | 'defaultMoldingFlasks'
>

type Ctx = { options: Options; responseData?: MoldPassportDetailResponse }

export function useMoldPassportFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, FA, V } = makeBinders<T, Ctx>(ctxRef)

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Паспорт ливарної форми</h5>),

      MoldingAreaSelect: F('moldingAreaId', (name, { options }) => (
        <Form.Controller name={name}>
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
      )),

      MoldingAreaDynamic: F('moldingAreaId', () => (
        <DynamicFieldArea section="moldingAreaId" showInactive />
      )),

      PatternPlateFrameSelect: F('patternPlateFrameId', (name, { options }) => (
        <Form.Controller name={name}>
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
      )),

      MoldingFlaskSelect: F('moldingFlaskId', (name, { options }) => (
        <Form.Controller name={name}>
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
      )),

      CastingTechnologyDynamic: FA(['dataGsc', 'dataAsc'] as const, (names) => (
        <Form.WithError name={[...names]}>
          <DynamicFieldArea section="castingTechnologyId" />
        </Form.WithError>
      )),

      MoldCavitiesArray: F('moldCavities', (name, { responseData }) => (
        <Form.WithError name={name}>
          <DynamicFieldArray
            title="Відбиток деталі у формі"
            label="відбиток деталі у формі"
            name="moldCavities"
            form={MoldCavityForm}
            defaultItem={moldCavityFormDefaultValues}
            itemsData={responseData?.moldCavities}
          />
        </Form.WithError>
      )),

      PressingPressureField: F('pressingPressure', (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label="Тиск, од." {...register} />}
        </Form.Field>
      )),

      SequenceInShiftField: F('sequenceInShift', (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label="Порядковий номер форми за зміну" {...register} />}
        </Form.Field>
      )),

      AssemblyTimestampField: F('assemblyTimestamp', (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="datetime"
              label="Дата та час складання півформ"
            />
          )}
        </Form.Controller>
      )),

      IsDefectiveField: F('isDefective', (name) => (
        <Form.Field name={name}>
          {({ register }) => <Checkbox label="Наявність дефектів" {...register} />}
        </Form.Field>
      )),

      NotesField: F('notes', (name) => (
        <Form.Field name={name}>
          {({ register }) => <TextareaField label="Нотатка" {...register} />}
        </Form.Field>
      )),

      SubmitButton: V(
        'SubmitButton',
        ({ text, disabled }: { text: string; disabled?: boolean }) => (
          <Form.WithError name="root">
            <Button className="w-full" type="submit" disabled={disabled}>
              {text}
            </Button>
          </Form.WithError>
        ),
      ),
    } as const)
  }, [])

  return Fields
}
