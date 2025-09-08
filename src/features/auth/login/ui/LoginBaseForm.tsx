import { useLoginFormFields } from '@/entities/auth/login/ui/form/fields'
import type { LoginFormFields } from '@/features/auth/login/model/schema'
import type { TokenPairResponse } from '@/shared/api/soil-lab/model'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'
import type { FormBaseProps } from '@/types/react-hook-form'

export type LoginBaseFormProps = FormBaseProps<LoginFormFields, TokenPairResponse>

export function LoginBaseForm({ isSubmitting, responseData, submitBtnName }: LoginBaseFormProps) {
  const Form = useFormKit<LoginFormFields>()
  const F = useLoginFormFields(Form, {
    responseData,
  })
  return (
    <>
      <F.email />

      <F.password />

      <F.rememberMe />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}
