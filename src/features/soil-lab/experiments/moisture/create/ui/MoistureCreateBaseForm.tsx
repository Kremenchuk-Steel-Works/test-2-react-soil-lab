import {
  useMoistureFormFields,
  type TestMoistureResponse,
} from '@/entities/soil-lab/experiments/ui/form/fields'
import type { MoistureCreateFormFields } from '@/features/soil-lab/experiments/moisture/create/model/schema'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type MoistureCreateBaseFormProps = FormBaseProps<
  MoistureCreateFormFields,
  TestMoistureResponse
>

export function MoistureCreateBaseForm({
  isSubmitting,
  responseData,
  submitBtnName,
}: MoistureCreateBaseFormProps) {
  const Form = useFormKit<MoistureCreateFormFields>()
  const F = useMoistureFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.Title />

      <F.moldingSandNumber />

      <F.ambientTempMoldAssemblyArea />

      <F.measurements />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
