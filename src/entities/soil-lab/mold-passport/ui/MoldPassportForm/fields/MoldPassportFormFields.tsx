// useMoldPassportFormFields.tsx
import React, { useMemo, useRef, type JSX } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
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

type Options = Pick<
  MoldPassportFormOptions,
  | 'loadMoldingAreas'
  | 'defaultMoldingAreas'
  | 'loadPatternPlateFrames'
  | 'defaultPatternPlateFrames'
  | 'loadMoldingFlasks'
  | 'defaultMoldingFlasks'
>

type Ctx = {
  options: Options
  responseData?: MoldPassportDetailResponse
}

// -------- биндеры: делаем поля React.memo без пропсов, ctx читаем из ref --------
function makeBinders<T extends FieldValues>(ctxRef: React.MutableRefObject<Ctx>) {
  function F<Name extends string>(
    name: Name,
    render: (name: Path<T>, ctx: Ctx) => JSX.Element,
  ): Name extends Path<T> ? React.FC : never {
    const Comp: React.FC = React.memo(() => render(name as unknown as Path<T>, ctxRef.current))
    // помогаем в devtools
    Comp.displayName = `Field(${String(name)})`
    return Comp as unknown as Name extends Path<T> ? React.FC : never
  }

  function FA<Keys extends readonly string[]>(
    names: Keys,
    render: (names: Path<T>[], ctx: Ctx) => JSX.Element,
  ): Exclude<Keys[number], Path<T>> extends never ? React.FC : never {
    const Comp: React.FC = React.memo(() => render(names as unknown as Path<T>[], ctxRef.current))
    Comp.displayName = `FieldAll(${(names as readonly string[]).join(',')})`
    return Comp as unknown as Exclude<Keys[number], Path<T>> extends never ? React.FC : never
  }

  return { F, FA }
}

export function useMoldPassportFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  // ctx может меняться, но идентичность компонентов — нет
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  // создаём реестр ровно один раз на маунт формы
  const Fields = useMemo(() => {
    const { F, FA } = makeBinders<T>(ctxRef)

    const Title = React.memo(() => <h5 className="layout-text">Паспорт ливарної форми</h5>)
    Title.displayName = 'Title'

    const MoldingAreaSelect = F('moldingAreaId', (name, { options }) => (
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
    ))

    const MoldingAreaDynamic = F('moldingAreaId', () => (
      <DynamicFieldArea section="moldingAreaId" showInactive />
    ))

    const PatternPlateFrameSelect = F('patternPlateFrameId', (name, { options }) => (
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
    ))

    const MoldingFlaskSelect = F('moldingFlaskId', (name, { options }) => (
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
    ))

    const CastingTechnologyDynamic = FA(['dataGsc', 'dataAsc'] as const, (names) => (
      <Form.WithError name={names}>
        <DynamicFieldArea section="castingTechnologyId" />
      </Form.WithError>
    ))

    const MoldCavitiesArray = F('moldCavities', (name, { responseData }) => (
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
    ))

    const PressingPressureField = F('pressingPressure', (name) => (
      <Form.Field name={name}>
        {({ register }) => <InputField label="Тиск, од." {...register} />}
      </Form.Field>
    ))

    const SequenceInShiftField = F('sequenceInShift', (name) => (
      <Form.Field name={name}>
        {({ register }) => <InputField label="Порядковий номер форми за зміну" {...register} />}
      </Form.Field>
    ))

    const AssemblyTimestampField = F('assemblyTimestamp', (name) => (
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
    ))

    const IsDefectiveField = F('isDefective', (name) => (
      <Form.Field name={name}>
        {({ register }) => <Checkbox label="Наявність дефектів" {...register} />}
      </Form.Field>
    ))

    const NotesField = F('notes', (name) => (
      <Form.Field name={name}>
        {({ register }) => <TextareaField label="Нотатка" {...register} />}
      </Form.Field>
    ))

    const SubmitButton: React.FC<{ text: string; disabled?: boolean }> = React.memo(
      ({ text, disabled }) => (
        <Form.WithError name="root">
          <Button className="w-full" type="submit" disabled={disabled}>
            {text}
          </Button>
        </Form.WithError>
      ),
    )
    SubmitButton.displayName = 'SubmitButton'

    return {
      Title,
      MoldingAreaSelect,
      MoldingAreaDynamic,
      PatternPlateFrameSelect,
      MoldingFlaskSelect,
      CastingTechnologyDynamic,
      MoldCavitiesArray,
      PressingPressureField,
      SequenceInShiftField,
      AssemblyTimestampField,
      IsDefectiveField,
      NotesField,
      SubmitButton,
    }
  }, []) // важно: реестр создаётся один раз

  return Fields
}
