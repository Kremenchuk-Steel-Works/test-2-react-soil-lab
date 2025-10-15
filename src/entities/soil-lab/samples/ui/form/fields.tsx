import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { SamplesFormOptions } from '@/entities/soil-lab/samples/hooks/useSamplesFormOptions'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Options = Pick<
  SamplesFormOptions,
  'loadMaterials' | 'defaultMaterials' | 'loadMaterialSources' | 'defaultMaterialSources'
>

type Ctx = { options: Options; responseData?: SampleDetailResponse }

export type SamplesCreateOptions = {
  options: {
    moldingSandRecipe: Option[]
  }
}

export function useSamplesFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    const { materialId, materialSourceId, temperature, note } = samplesFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Створення зразка</h5>),

      [materialId.key]: F(materialId.key, (name, { options }) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={options.loadMaterials}
              defaultOptions={options.defaultMaterials}
              isVirtualized
              isClearable
              placeholder={materialId.label.default + ' *'}
            />
          )}
        </Form.Controller>
      )),

      [materialSourceId.key]: F(materialSourceId.key, (name, { options }) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={options.loadMaterialSources}
              defaultOptions={options.defaultMaterialSources}
              isVirtualized
              isClearable
              placeholder={materialSourceId.label.default + ' *'}
            />
          )}
        </Form.Controller>
      )),

      [temperature.key]: F(temperature.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={`${temperature.label.default} *`} type="float" {...register} />
          )}
        </Form.Field>
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
