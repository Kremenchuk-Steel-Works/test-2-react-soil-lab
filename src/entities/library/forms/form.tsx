import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form'
import FormFileUpload from '@/shared/ui/forms/FormFileUpload'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
import { librarySchema, type LibraryFormFields } from './schema'

type FormFields = LibraryFormFields
const schema = librarySchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function LibraryForm({ defaultValues, onSubmit, submitBtnName }: FormProps) {
  const {
    control,
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
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Коротка назва"
        {...register('shortName', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'shortName')}
      />

      <InputFieldWithError
        label="Повна назва"
        {...register('fullName', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'fullName')}
      />

      <Controller
        name="keywords"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={[]}
            isVirtualized
            isMulti
            isClearable
            isCreatable
            placeholder="Ключові слова"
            errorMessage={getNestedErrorMessage(errors, 'keywords')}
          />
        )}
      />

      <Controller
        name="file"
        control={control}
        render={({ field, fieldState }) => (
          <FormFileUpload
            field={field}
            fieldState={fieldState}
            label="Документ"
            fileType="document"
            errorMessage={getNestedErrorMessage(errors, 'file')}
          />
        )}
      />

      <ButtonWithError
        className="w-full"
        type="submit"
        errorMessage={errors.root?.message}
        disabled={isSubmitting}
      >
        {submitBtnName}
      </ButtonWithError>
    </form>
  )
}
