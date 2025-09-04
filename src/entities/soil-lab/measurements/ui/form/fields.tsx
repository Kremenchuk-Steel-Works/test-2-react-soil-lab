import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Ctx = { responseData?: MoldPassportDetailResponse }

export function useMeasurementsFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Вимірювання суміші</h5>),

      MoldingSandNumberField: F('moldingSandNumber', (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label="№ суміші *" {...register} />}
        </Form.Field>
      )),

      StrengthKgfCm2Field: F('moldingSandStrengthKgfCm2', (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label="Міцність на стиск (кгс/см²) *" {...register} />}
        </Form.Field>
      )),

      GasPermeabilityField: F('moldingSandGasPermeability', (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label="Газопроникність (од.) *" {...register} />}
        </Form.Field>
      )),

      MoisturePercentField: F('moldingSandMoisturePercent', (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label="Вологість (%) *" {...register} />}
        </Form.Field>
      )),

      PerformedAtField: F('performedAt', (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="datetime"
              label="Дата й час вимірювання"
            />
          )}
        </Form.Controller>
      )),

      NoteField: F('note', (name) => (
        <Form.Field name={name}>
          {({ register }) => <TextareaField label="Примітка" {...register} />}
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
  }, [Form])

  return Fields
}
