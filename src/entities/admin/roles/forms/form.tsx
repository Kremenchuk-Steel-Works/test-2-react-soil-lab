import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from '@/shared/ui/with-error/fieldsWithError'
import { rolesSchema, type RolesFormFields } from '@/entities/admin/roles/forms/schema'
import { logger } from '@/shared/lib/logger'
import {
  formTransformers,
  getNestedErrorMessage,
} from '@/shared/lib/react-hook-form'
import { useQuery } from "@tanstack/react-query"
import AlertMessage, {
  AlertType,
} from '@/shared/ui/alert-message/AlertMessage'
import type { Option } from '@/shared/ui/select/ReactSelect'
import type { PermissionLookupResponse } from '@/entities/admin/permissions/types/response.dto'
import { permissionService } from '@/entities/admin/permissions/services/service'
import { permissionQueryKeys } from '@/entities/admin/permissions/services/keys'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'

type FormFields = RolesFormFields
const schema = rolesSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function RolesForm({
  defaultValues,
  onSubmit,
  submitBtnName,
}: FormProps) {
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
      logger.debug("Форма успешно выполнена", response)
    } catch (err) {
      const error = err as Error
      setError("root", { message: error.message })
      logger.error(err)
    }
  }

  // Query
  const {
    data: permissionsData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PermissionLookupResponse[], Error>({
    queryKey: permissionQueryKeys.lookups(),
    queryFn: () => permissionService.getLookup(),
  })

  // Loading || Error
  if (isLoading) return
  if (isError) {
    return <AlertMessage type={AlertType.ERROR} message={queryError.message} />
  }

  // Options
  const permissionsOptions: Option<number>[] =
    permissionsData?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Назва"
        {...register("name", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "name")}
      />

      <InputFieldWithError
        label="Опис"
        {...register("description", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "description")}
      />

      <Controller
        name="permissionIds"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={permissionsOptions}
            isVirtualized
            isMulti
            isClearable
            placeholder="Оберіть права доступу"
            errorMessage={getNestedErrorMessage(errors, "permissionIds")}
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
