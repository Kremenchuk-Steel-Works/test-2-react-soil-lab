import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { useTestsFormFields } from '@/entities/soil-lab/tests/ui/form/fields'
import type { Measurement1FormFields } from '@/entities/soil-lab/tests/ui/form/lib/dynamic-sections'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { Option } from '@/shared/ui/select/ReactSelect'

const { strength } = testsTypeFieldRegistry

type Meta = {
  submitBtnName?: string
  isSubmitting?: boolean
}

export function StrengthDynamicForm() {
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

      <F.Title text={strength.label.short} />

      <F.strength />

      <F.SubmitButton text={meta?.submitBtnName} disabled={meta?.isSubmitting} />
    </>
  )
}
