import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { samplesMixturesOptions } from '@/entities/soil-lab/samples/model/mixtures'
import {
  testsFieldRegistry,
  testsTypeFieldRegistry,
} from '@/entities/soil-lab/tests/model/fields-registry'
import { testsTypeOptions } from '@/entities/soil-lab/tests/model/type'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Ctx = { responseData?: SampleDetailResponse }

export function useTestsFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    const { sampleId, type, measurement1, moldingSandRecipe } = testsFieldRegistry
    const { gasPermeability, moisturePercent, strength } = testsTypeFieldRegistry

    return Object.freeze({
      [sampleId.key]: F(sampleId.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={sampleId.label.default + ' *'} disabled {...register} />
          )}
        </Form.Field>
      )),

      [moldingSandRecipe.key]: F(moldingSandRecipe.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={samplesMixturesOptions}
              isVirtualized
              isClearable
              isDisabled
              placeholder={type.label.default + ' *'}
            />
          )}
        </Form.Controller>
      )),

      [type.key]: F(type.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={testsTypeOptions}
              isVirtualized
              isClearable
              isDisabled
              placeholder={type.label.default + ' *'}
            />
          )}
        </Form.Controller>
      )),

      measurement1Dynamic: F(measurement1.key, () => (
        <DynamicFieldArea section={measurement1.key} />
      )),

      [moisturePercent.key]: F(measurement1.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={moisturePercent.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [gasPermeability.key]: F(measurement1.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={gasPermeability.label.m2PerPas + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [strength.key]: F(measurement1.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label={strength.label.nPerCm2 + ' *'} {...register} />}
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
