import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { loginSchema, type LoginFormFields } from '@/entities/auth/forms/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import {
  ButtonWithError,
  CheckboxWithError,
  InputFieldWithError,
} from '@/shared/ui/with-error/fieldsWithError'

type FormFields = LoginFormFields
const schema = loginSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function LoginForm({ defaultValues, onSubmit, submitBtnName }: FormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      const error = err as Error
      setError('root', { message: error.message })
      logger.error(err)
    }
  }

  return (
    <FormLayout onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Email"
        errorMessage={errors.email?.message}
        {...register('email')}
      />

      <InputFieldWithError
        label="Пароль"
        type="password"
        {...register('password')}
        errorMessage={getNestedErrorMessage(errors, 'password')}
      />

      <CheckboxWithError
        label="Запам'ятати мене"
        {...register(`rememberMe`, formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'rememberMe')}
      />

      <ButtonWithError
        className="w-full"
        type="submit"
        errorMessage={errors.root?.message}
        disabled={isSubmitting}
      >
        {submitBtnName}
      </ButtonWithError>
    </FormLayout>
  )
}
