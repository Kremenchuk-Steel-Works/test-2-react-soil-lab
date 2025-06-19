import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from "../../../../shared/ui/with-error/fieldsWithError"
import { permissionsSchema, type PermissionsFormFields } from "./schema"
import { logger } from "../../../../shared/lib/logger"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../shared/lib/react-hook-form"
import type { Option } from "../../../../shared/ui/select/ReactSelect"
import AlertMessage, {
  AlertType,
} from "../../../../shared/ui/alert-message/AlertMessage"
import { useQuery } from "@tanstack/react-query"
import type { DepartmentLookupResponse } from "../../departments/types/response.dto"
import { departmentService } from "../../departments/services/service"
import { departmentQueryKeys } from "../../departments/services/keys"
import FormSelectField from "../../../../shared/ui/forms/FormReactSelect"

type FormFields = PermissionsFormFields
const schema = permissionsSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function PermissionsForm({
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
            errorMessage={getNestedErrorMessage(errors, "departmentId")}
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
