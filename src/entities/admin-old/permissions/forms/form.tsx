import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  permissionsSchema,
  type PermissionsFormFields,
} from '@/entities/admin-old/permissions/forms/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = PermissionsFormFields
const schema = permissionsSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function PermissionsForm({ defaultValues, onSubmit, submitBtnName }: FormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const submitHandler = useCallback<SubmitHandler<FormFields>>(
    async (data) => {
      try {
        const response = await onSubmit(data)
        logger.debug('Форма успешно выполнена', response)
      } catch (err) {
        const error = err as Error
        setError('root', { message: error.message })
        logger.error(err)
      }
    },
    [onSubmit, setError],
  )

  return (
    <FormLayout onSubmit={(e) => void handleSubmit(submitHandler)(e)}>
      <h5 className="layout-text">Права доступу</h5>

      <InputFieldWithError
        label="Назва"
        {...register('name', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'name')}
      />

      <InputFieldWithError
        label="Код"
        {...register('code', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'code')}
      />

      <InputFieldWithError
        label="Опис"
        {...register('description', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'description')}
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
