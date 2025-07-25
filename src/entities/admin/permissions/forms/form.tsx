import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { departmentQueryKeys } from '@/entities/admin/departments/services/keys'
import { departmentService } from '@/entities/admin/departments/services/service'
import type { DepartmentLookupResponse } from '@/entities/admin/departments/types/response.dto'
import {
  permissionsSchema,
  type PermissionsFormFields,
} from '@/entities/admin/permissions/forms/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { Option } from '@/shared/ui/select/ReactSelect'
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

  const {
    data: departmentsData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<DepartmentLookupResponse[], Error>({
    queryKey: departmentQueryKeys.lookups(),
    queryFn: () => departmentService.getLookup(),
  })

  const departmentsOptions: Option[] =
    departmentsData?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  if (isLoading) return
  if (isError) {
    return <AlertMessage type={AlertType.ERROR} message={queryError.message} />
  }

  return (
    <FormLayout onSubmit={handleSubmit(submitHandler)}>
      <h4 className="layout-text">Права доступу</h4>

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

      <Controller
        name="departmentId"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={departmentsOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть відділ"
            errorMessage={getNestedErrorMessage(errors, 'departmentId')}
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
    </FormLayout>
  )
}
