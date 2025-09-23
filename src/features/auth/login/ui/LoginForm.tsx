import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { loginFormSchema, type LoginFormFields } from '@/features/auth/login/model/schema'
import { LoginFormKit } from '@/features/auth/login/ui/formKit'
import { LoginBaseForm } from '@/features/auth/login/ui/LoginBaseForm'
import type { TokenPairResponse } from '@/shared/api/soil-lab/model'
import { applyServerErrors } from '@/shared/lib/axios/applyServerErrors'
import { createLogger } from '@/shared/lib/logger'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('AuthForm')

type FormFields = LoginFormFields
const schema = loginFormSchema

type LoginFormProps = FormProps<FormFields, TokenPairResponse>

const Form = LoginFormKit

export function LoginForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: LoginFormProps) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const {
    handleSubmit,
    setError,
    setFocus,
    getFieldState,
    formState,
    formState: { isSubmitting },
  } = form
  // Submit
  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      applyServerErrors({
        err,
        setError,
        setFocus,
        getFieldState,
        formState,
        overrides: [
          (parsed) => {
            if (parsed.status === 401 && parsed.message === 'Invalid password') {
              setError('password', { type: 'server', message: 'Невірний пароль' })
              return true
            }
            return false
          },
        ],
      })
    }
  }

  return (
    <FormProvider {...form}>
      <FormLayout onSubmit={(e) => void handleSubmit(submitHandler)(e)}>
        <FormKitProvider value={Form}>
          <LoginBaseForm
            responseData={responseData}
            isSubmitting={isSubmitting}
            submitBtnName={submitBtnName}
          />
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
