import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { experimentsMachineTypesOptions } from '@/entities/soil-lab/experiments/model/machineTypes'
import { experimentsMixturesOptions } from '@/entities/soil-lab/experiments/model/mixtures'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

export interface TestExperimentsResponse {
  measurements: { id: string; experimentsContentPercent: number }[]
}

type Ctx = { responseData?: TestExperimentsResponse }

export function useExperimentsFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, FA, V } = makeBinders<T, Ctx>(ctxRef)

    const { moldingSandNumber, ambientTempMoldAssemblyArea, machineType } = experimentsFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Эксперимент</h5>),

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

      [machineType.key]: F(machineType.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              options={experimentsMachineTypesOptions}
              isVirtualized
              isClearable
              placeholder={machineType.label.default + ' *'}
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

      experimentsContentDynamic: FA(
        [moldingSandNumber.key, ambientTempMoldAssemblyArea.key] as const,
        () => <DynamicFieldArea section={'experimentsContentDynamic'} />,
      ),
    } as const)
  }, [Form])

  return Fields
}
