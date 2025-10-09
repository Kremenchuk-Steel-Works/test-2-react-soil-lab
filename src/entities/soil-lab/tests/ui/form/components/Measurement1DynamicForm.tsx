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
  compressiveStrength,
  tensileStrength,
  tensileStrengthAfter0Hours,
  tensileStrengthAfter1Hour,
  tensileStrengthAfter24Hours,
  tensileStrengthAfter3Hours,
  gasFormingProperty,
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

export function CompressiveStrengthDynamicForm() {
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

      <F.Title text={compressiveStrength.label.short} />

      <F.experimentalCompressiveStrength />

      <F.SubmitButton text={meta?.submitBtnName} disabled={meta?.isSubmitting} />
    </>
  )
}

// export function CompressiveStrengthDynamicForm() {
//   return Measurement1DynamicForm({
//     title: compressiveStrength.label.short,
//     type: TestType.compressive_strength,
//   })
// }

export function TensileStrengthDynamicForm() {
  return Measurement1DynamicForm({
    title: tensileStrength.label.short,
    type: TestType.tensile_strength,
  })
}

export function GasFormingPropertyDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={gasFormingProperty.label.short}
      type={TestType.gas_forming_property}
    />
  )
}

export function TensileStrengthAfter0HoursDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrengthAfter0Hours.label.short}
      type={TestType.tensile_strength_after_0_hours}
    />
  )
}

export function TensileStrengthAfter1HourDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrengthAfter1Hour.label.short}
      type={TestType.tensile_strength_after_1_hour}
    />
  )
}

export function TensileStrengthAfter24HoursDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrengthAfter24Hours.label.short}
      type={TestType.tensile_strength_after_24_hours}
    />
  )
}

export function TensileStrengthAfter3HoursDynamicForm() {
  return (
    <Measurement1DynamicForm
      title={tensileStrengthAfter3Hours.label.short}
      type={TestType.tensile_strength_after_3_hours}
    />
  )
}
