import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { permissionsSchema, type PermissionsFormFields } from "./schema"
import { logger } from "../../../../lib/logger"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"
import type { Option } from "../../../../components/Select/ReactSelect"
import AlertMessage, { AlertType } from "../../../../components/AlertMessage"
import { useQuery } from "@tanstack/react-query"
import type { DepartmentLookupResponse } from "../../departments/types/response.dto"
import { departmentsService } from "../../departments/services/service"

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

  // Query
  const {
    data: departmentsData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<DepartmentLookupResponse[], Error>({
    queryKey: ["adminDepartmentLookupData"],
    queryFn: () => departmentsService.getLookup(),
  })

  // Loading || Error
  if (isLoading) return
  if (isError) {
    return <AlertMessage type={AlertType.ERROR} message={queryError.message} />
  }

  // Options
  const departmentsOptions: Option[] =
    departmentsData?.map((c) => ({
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
        name="departmentId"
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть відділ"
            isClearable={true}
            onChange={(option) => field.onChange(option?.value)}
            options={departmentsOptions}
            value={departmentsOptions.find((opt) => opt.value === field.value)}
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
