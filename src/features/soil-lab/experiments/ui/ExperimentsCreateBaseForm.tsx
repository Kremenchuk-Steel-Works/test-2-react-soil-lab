import {
  useExperimentsFormFields,
  type TestExperimentsResponse,
} from '@/entities/soil-lab/experiments/ui/form/fields'
import type { ExperimentsCreateFormFields } from '@/features/soil-lab/experiments/model/schema'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type ExperimentsCreateBaseFormProps = FormBaseProps<
  ExperimentsCreateFormFields,
  TestExperimentsResponse
>

export function ExperimentsCreateBaseForm({ responseData }: ExperimentsCreateBaseFormProps) {
  const Form = useFormKit<ExperimentsCreateFormFields>()
  const F = useExperimentsFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.Title />

      <F.moldingSandNumber />
      <F.machineType />
      <F.ambientTempMoldAssemblyArea />
    </>
  )
}
