import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { useTestsFormFields } from '@/entities/soil-lab/tests/ui/form/fields'
import type { Measurement1FormFields } from '@/entities/soil-lab/tests/ui/form/lib/dynamic-sections'
import { TestType, type SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { Option } from '@/shared/ui/select/ReactSelect'

const {
  gasPermeability,
  moisturePercent,
  strength,
  tensileStrength,
  tensileStrength0h,
  tensileStrength1h,
  tensileStrength24h,
  tensileStrength3h,
  gasEvolution,
} = testsTypeFieldRegistry

type Meta = {
  submitBtnName?: string
  isSubmitting?: boolean
}

type Props = {
  title: string
  type: TestType
}

export function Measurement1DynamicForm({ title, type }: Props) {
  const Form = useFormKit<Measurement1FormFields>()
  const { responseData, meta } = useDynamicMeta<Option[], SampleDetailResponse, Meta>()
  const F = useTestsFormFields(Form, {
    responseData,
  })

  return (
    <>
      {/* <F.sampleId /> */}

      {/* <F.moldingSandRecipe /> */}

      {/* <F.type /> */}

      <F.Title text={title} />

      <F.measurement1 type={type} />

      <F.SubmitButton text={meta?.submitBtnName} disabled={meta?.isSubmitting} />
    </>
  )
}

export function GasPermabilityDynamicForm() {
  return Measurement1DynamicForm({
    title: gasPermeability.label.short,
    type: TestType.gas_permeability,
  })
}

export function MoisturePercentDynamicForm() {
  return Measurement1DynamicForm({
    title: moisturePercent.label.short,
    type: TestType.moisture_percent,
  })
}

export function StrengthDynamicForm() {
  return Measurement1DynamicForm({
    title: strength.label.short,
    type: TestType.strength,
  })
}

export function TensileStrengthDynamicForm() {
  return Measurement1DynamicForm({
    title: tensileStrength.label.short,
    type: TestType.tensile_strength,
  })
}

export function GasEvolutionDynamicForm() {
  return <Measurement1DynamicForm title={gasEvolution.label.short} type={TestType.gas_evolution} />
}

export function TensileStrength0hDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrength0h.label.short}
      type={TestType.tensile_strength_0h}
    />
  )
}

export function TensileStrength1hDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrength1h.label.short}
      type={TestType.tensile_strength_1h}
    />
  )
}

export function TensileStrength24hDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrength24h.label.short}
      type={TestType.tensile_strength_24h}
    />
  )
}

export function TensileStrength3hDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrength3h.label.short}
      type={TestType.tensile_strength_3h}
    />
  )
}
