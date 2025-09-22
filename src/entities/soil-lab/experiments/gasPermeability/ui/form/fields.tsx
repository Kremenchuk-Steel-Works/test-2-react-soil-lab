import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { gasPermeabilityFieldRegistry } from '@/entities/soil-lab/experiments/gasPermeability/model/fields-registry'
import { useExperimentsFormFields } from '@/entities/soil-lab/experiments/ui/form/fields'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

export interface TestGasPermeabilityResponse {
  measurements: { id: string; gasPermeability: number }[]
}

type Ctx = { responseData?: TestGasPermeabilityResponse }

export function useGasPermeabilityFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const CommonFields = useExperimentsFormFields<T>(Form, {})
  const Fields = useMemo(() => {
    const { F, FA, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandNumber, machineType, gasPermeability } = gasPermeabilityFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Визначення газопроникності</h5>),

      // Common fields
      [moldingSandNumber.key]: CommonFields[moldingSandNumber.key],
      [machineType.key]: CommonFields[machineType.key],

      // Fields
      gasPermeabilityDynamic: FA([moldingSandNumber.key, gasPermeability.key] as const, () => (
        <DynamicFieldArea section={gasPermeability.key} />
      )),

      [gasPermeability.key]: F(gasPermeability.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={gasPermeability.label.default + ' *'} {...register} />
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
  }, [Form, CommonFields])

  return Fields
}
