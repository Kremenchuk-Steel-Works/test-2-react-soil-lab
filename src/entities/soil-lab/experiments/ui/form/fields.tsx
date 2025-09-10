import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { EXPERIMENTS as FR } from '@/entities/soil-lab/experiments/model/fields-registry'
import { ExperimentsMeasurementForm } from '@/entities/soil-lab/experiments/ui/form/ExperimentsMeasurementForm'
import { experimentsMeasurementFormDefaultValues } from '@/entities/soil-lab/experiments/ui/form/schema'
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

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Визначення масової частки вологи </h5>),

      [FR.moldingSandNumber.key]: F(FR.moldingSandNumber.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={FR.moldingSandNumber.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [FR.ambientTempMoldAssemblyArea.key]: F(FR.ambientTempMoldAssemblyArea.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField label={FR.ambientTempMoldAssemblyArea.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [FR.measurements.key]: F(FR.measurements.key, (name, { responseData }) => (
        <Form.WithError name={name}>
          <DynamicFieldArray
            title={FR.measurements.label.default}
            label="значення"
            name={FR.measurements.key}
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
