import { useTestsFormFields } from '@/entities/soil-lab/tests/ui/form/fields'
import type { TestsCreateFormFields } from '@/features/soil-lab/tests/create/model/schema'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type TestsCreateBaseFormProps = FormBaseProps<TestsCreateFormFields, SampleDetailResponse>

export function TestsCreateBaseForm({ responseData }: TestsCreateBaseFormProps) {
  const Form = useFormKit<TestsCreateFormFields>()
  const F = useTestsFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.measurement1Dynamic />
    </>
  )
}
