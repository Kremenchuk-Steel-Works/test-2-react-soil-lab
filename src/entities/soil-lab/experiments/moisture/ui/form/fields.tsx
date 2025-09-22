import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import { useExperimentsFormFields } from '@/entities/soil-lab/experiments/ui/form/fields'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

export interface TestMoistureResponse {
  measurements: { id: string; moistureContentPercent: number }[]
}

type Ctx = { responseData?: TestMoistureResponse }

export function useMoistureFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const CommonFields = useExperimentsFormFields<T>(Form, {})
  const Fields = useMemo(() => {
    const { F, FA, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandNumber, machineType, ambientTempMoldAssemblyArea, moistureContentPercent } =
      moistureFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Визначення масової частки вологи</h5>),

      // Common fields
      [moldingSandNumber.key]: CommonFields[moldingSandNumber.key],
      [ambientTempMoldAssemblyArea.key]: CommonFields[ambientTempMoldAssemblyArea.key],
      [machineType.key]: CommonFields[machineType.key],

      // Fields
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
        ({
          text,
          disabled,
          mode = 'form',
          onClick,
        }: {
          text?: string
          disabled?: boolean
          mode?: 'form' | 'section'
          onClick?: () => void
        }) => (
          <Form.WithError name="root">
            <Button
              className="w-full"
              disabled={disabled}
              type={mode === 'form' ? 'submit' : 'button'}
              onClick={mode === 'section' ? onClick : undefined}
            >
              {text}
            </Button>
          </Form.WithError>
        ),
      ),
    } as const)
  }, [Form, CommonFields])

  return Fields
}
