import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisure/model/fields-registry'
import { ExperimentsMeasurementForm } from '@/entities/soil-lab/experiments/moisure/ui/form/ExperimentsMeasurementForm'
import { experimentsMeasurementFormDefaultValues } from '@/entities/soil-lab/experiments/moisure/ui/form/schema'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
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
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandNumber, ambientTempMoldAssemblyArea, measurements } = moistureFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Визначення масової частки вологи </h5>),

      [moldingSandNumber.key]: F(moldingSandNumber.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={moldingSandNumber.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [ambientTempMoldAssemblyArea.key]: F(ambientTempMoldAssemblyArea.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={ambientTempMoldAssemblyArea.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [measurements.key]: F(measurements.key, (name, { responseData }) => (
        <Form.WithError name={name}>
          <DynamicFieldArray
            title={measurements.label.default}
            label="значення"
            name={measurements.key}
            form={ExperimentsMeasurementForm}
            defaultItem={experimentsMeasurementFormDefaultValues}
            itemsData={responseData?.measurements}
          />
        </Form.WithError>
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
