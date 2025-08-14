import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  departmentsSchema,
  type DepartmentsFormFields,
} from '@/entities/admin/departments/forms/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = DepartmentsFormFields
const schema = departmentsSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function DepartmentsForm({ defaultValues, onSubmit, submitBtnName }: FormProps) {
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
      <h5 className="layout-text">Відділ</h5>

      <InputFieldWithError
        label="Назва"
        {...register('name', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'name')}
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
