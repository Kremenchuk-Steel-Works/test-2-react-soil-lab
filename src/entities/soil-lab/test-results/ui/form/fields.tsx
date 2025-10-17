import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { testsFieldRegistry } from '@/entities/soil-lab/test-results/model/fields-registry'
import { type SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { Transforms } from '@/shared/lib/zod/unit-conversion/transforms'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Ctx = { responseData?: SampleDetailResponse }

const AFS_LABELS: Record<keyof AfsGrainFinenessNumberArgs, string> = {
  sieve1p25MmPercent: 'Сито 1.25 мм, %',
  sieve1MmPercent: 'Сито 1.0 мм, %',
  sieve0p7MmPercent: 'Сито 0.7 мм, %',
  sieve0p5MmPercent: 'Сито 0.5 мм, %',
  sieve0p355MmPercent: 'Сито 0.355 мм, %',
  sieve0p25MmPercent: 'Сито 0.25 мм, %',
  sieve0p18MmPercent: 'Сито 0.18 мм, %',
  sieve0p125MmPercent: 'Сито 0.125 мм, %',
  sieve0p09MmPercent: 'Сито 0.09 мм, %',
  sieve0p063MmPercent: 'Сито 0.063 мм, %',
  panPercent: 'Піддон, %',
} as const

export function useTestsFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, FA, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandRecipe } = samplesFieldRegistry
    const { sampleId, type, measurement1 } = testsFieldRegistry
    const {
      gasPermeability,
      moisturePercent,
      compressiveStrength,
      tensileStrength,
      tensileStrengthAfter0Hours,
      tensileStrengthAfter1Hour,
      tensileStrengthAfter3Hours,
      tensileStrengthAfter24Hours,
      gasFormingProperty,
    } = testsTypeFieldRegistry

    return Object.freeze({
      Title: V('Title', ({ text }: { text?: string }) => (
        <h5 className="layout-text">{`${text}`}</h5>
      )),

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
              options={samplesMoldingSandRecipeOptions}
              isVirtualized
              isClearable
              isDisabled
              placeholder={moldingSandRecipe.label.default + ' *'}
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

      // TestsType
      [measurement1.key]: F(measurement1.key, (name, { type }: { type: TestType }) => (
        <Form.Field name={name}>
          {({ register }) => {
            switch (type) {
              case TestType.gas_permeability:
                return (
                  <InputField
                    label={`${gasPermeability.label.m2PerPas} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.compressive_strength:
                return (
                  <InputField
                    label={`${compressiveStrength.label.nPerCm2} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.moisture_percent:
                return (
                  <InputField
                    label={`${moisturePercent.label.default} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.tensile_strength:
                return (
                  <InputField
                    label={`${tensileStrength.label.default} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.tensile_strength_after_0_hours:
                return (
                  <InputField
                    label={`${tensileStrengthAfter0Hours.label.default} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.tensile_strength_after_1_hour:
                return (
                  <InputField
                    label={`${tensileStrengthAfter1Hour.label.default} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.tensile_strength_after_3_hours:
                return (
                  <InputField
                    label={`${tensileStrengthAfter3Hours.label.default} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.tensile_strength_after_24_hours:
                return (
                  <InputField
                    label={`${tensileStrengthAfter24Hours.label.default} *`}
                    type="float"
                    {...register}
                  />
                )
              case TestType.gas_forming_property:
                return (
                  <InputField
                    label={`${gasFormingProperty.label.default} *`}
                    type="float"
                    {...register}
                  />
                )
              default:
                return <AlertMessage type={AlertType.WARNING} message="Тип тесту не визначено" />
            }
          }}
        </Form.Field>
      )),

      // Experimental
      experimentalCompressiveStrength: FA(
        [
          measurement1.key,
          ...Transforms.AFS_GRAIN_FINENESS_NUMBER_TRANSFORM.inputs.map(
            (p) => `${measurement1.key}.${p}` as const,
          ),
        ] as const,
        ([rootName, ...argPaths]) => (
          <>
            <Form.WithError name={rootName}>
              {argPaths.map((path, i) => {
                const k = Transforms.AFS_GRAIN_FINENESS_NUMBER_TRANSFORM.inputs[i]
                const label = AFS_LABELS[k]
                return (
                  <Form.Field key={path} name={path}>
                    {({ register }) => <InputField label={label} type="float" {...register} />}
                  </Form.Field>
                )
              })}
            </Form.WithError>
          </>
        ),
      ),

      // experimentalCompressiveStrength: FA(
      //   [measurement1.key, `${measurement1.key}.m1`, `${measurement1.key}.m`] as const,
      //   ([rootName, m1Name, mName]) => (
      //     <>
      //       <Form.WithError name={rootName}>
      //         <Form.Field name={m1Name}>
      //           {({ register }) => (
      //             <InputField label="Маса наважки, г *" type="float" {...register} />
      //           )}
      //         </Form.Field>

      //         <Form.Field name={mName}>
      //           {({ register }) => (
      //             <InputField label="Маса наважки, г *" type="float" {...register} />
      //           )}
      //         </Form.Field>
      //       </Form.WithError>
      //     </>
      //   ),
      // ),

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
