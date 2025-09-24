import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Ctx = { responseData?: SampleDetailResponse }

export function useSamplesFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandRecipe, receivedAt, note } = samplesFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Випробування формувальної суміші</h5>),

      [moldingSandRecipe.key]: F(moldingSandRecipe.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={moldingSandRecipe.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [receivedAt.key]: F(receivedAt.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="datetime"
              label={receivedAt.label.default + ' *'}
            />
          )}
        </Form.Controller>
      )),

      [note.key]: F(note.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => <TextareaField label={note.label.default} {...register} />}
        </Form.Field>
      )),

      SubmitButton: V(
        'SubmitButton',
        ({ text, disabled }: { text?: string; disabled?: boolean }) => (
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
