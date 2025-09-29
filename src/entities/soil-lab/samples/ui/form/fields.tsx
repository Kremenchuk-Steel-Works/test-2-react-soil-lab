import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { samplesMixturesOptions } from '@/entities/soil-lab/samples/model/mixtures'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'
import Button from '@/shared/ui/button/Button'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Ctx = { responseData?: SampleDetailResponse }

export function useSamplesFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandRecipe, note } = samplesFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Створення Sample</h5>),

      [moldingSandRecipe.key]: F(moldingSandRecipe.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={samplesMixturesOptions}
              isVirtualized
              isClearable
              placeholder={moldingSandRecipe.label.default + ' *'}
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
