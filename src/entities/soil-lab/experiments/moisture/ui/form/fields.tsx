import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { experimentsMixturesOptions } from '@/entities/soil-lab/experiments/model/mixtures'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

export interface TestMoistureResponse {
  measurements: { id: string; moistureContentPercent: number }[]
}

type Ctx = { responseData?: TestMoistureResponse }

export function useMoistureFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, FA, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandNumber, ambientTempMoldAssemblyArea, moistureContentPercent } =
      moistureFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Визначення масової частки вологи</h5>),

      [moldingSandNumber.key]: F(moldingSandNumber.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={experimentsMixturesOptions}
              isVirtualized
              isClearable
              placeholder={moldingSandNumber.label.default + ' *'}
            />
          )}
        </Form.Controller>
      )),

      [ambientTempMoldAssemblyArea.key]: F(ambientTempMoldAssemblyArea.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={ambientTempMoldAssemblyArea.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      moistureContentPercentDynamic: FA(
        [
          moldingSandNumber.key,
          ambientTempMoldAssemblyArea.key,
          moistureContentPercent.key,
        ] as const,
        () => <DynamicFieldArea section={moistureContentPercent.key} />,
      ),

      [moistureContentPercent.key]: F(moistureContentPercent.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={moistureContentPercent.label.default + ' *'} {...register} />
          )}
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
