import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { MEASUREMENTS as FR } from '@/entities/soil-lab/measurements/model/fields-registry'
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

      [FR.moldingSandNumber.key]: F(FR.moldingSandNumber.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={FR.moldingSandNumber.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [FR.moldingSandStrengthKgfCm2.key]: F(FR.moldingSandStrengthKgfCm2.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={FR.moldingSandStrengthKgfCm2.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [FR.moldingSandGasPermeability.key]: F(FR.moldingSandGasPermeability.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={FR.moldingSandGasPermeability.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [FR.moldingSandMoisturePercent.key]: F(FR.moldingSandMoisturePercent.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={FR.moldingSandMoisturePercent.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [FR.performedAt.key]: F(FR.performedAt.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="datetime"
              label={FR.performedAt.label.default + ' *'}
            />
          )}
        </Form.Controller>
      )),

      [FR.note.key]: F(FR.note.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => <TextareaField label={FR.note.label.default} {...register} />}
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
