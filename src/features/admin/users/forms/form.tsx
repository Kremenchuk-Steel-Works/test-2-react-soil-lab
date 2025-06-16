import {
  Controller,
  useForm,
  type DefaultValues,
  type Path,
  type SubmitHandler,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  CheckboxWithError,
} from "../../../../components/WithError/fieldsWithError"
import { ZodObject, type z, type ZodType } from "zod"
import { useQueries, type UseQueryResult } from "@tanstack/react-query"
import { roleService } from "../../roles/services/service"
import { permissionService } from "../../permissions/services/service"
import { personService } from "../../people/services/service"
import AlertMessage, { AlertType } from "../../../../components/AlertMessage"
import type { PersonLookupResponse } from "../../people/types/response.dto"
import type { RoleLookupResponse } from "../../roles/types/response.dto"
import type { PermissionLookupResponse } from "../../permissions/types/response.dto"
import type { Option } from "../../../../components/Select/ReactSelect"
import { logger } from "../../../../lib/logger"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"
import FormSelectField from "../../../../components/Forms/FormReactSelect"
import { personQueryKeys } from "../../people/services/keys"
import { roleQueryKeys } from "../../roles/services/keys"
import { permissionQueryKeys } from "../../permissions/services/keys"

interface FormProps<T extends ZodType<any, any>> {
  schema: T
  defaultValues?: DefaultValues<z.infer<T>>
  onSubmit: SubmitHandler<z.infer<T>>
  submitBtnName: string
}

export default function UsersForm<T extends ZodType<any, any>>({
  schema,
  defaultValues,
  onSubmit,
  submitBtnName,
}: FormProps<T>) {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const schemaKeys =
    schema instanceof ZodObject
      ? (Object.keys(schema.shape) as (keyof z.infer<T>)[])
      : []

  const submitHandler: SubmitHandler<z.infer<T>> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug("Форма успешно выполнена", response)
    } catch (err) {
      const error = err as Error
      setError("root", { message: error.message })
      logger.error(err)
    }
  }

  // Queries
  const queries = useQueries({
    queries: [
      {
        queryKey: personQueryKeys.lookups(),
        queryFn: () => personService.getLookup(),
      },
      {
        queryKey: roleQueryKeys.lookups(),
        queryFn: () => roleService.getLookup(),
      },
      {
        queryKey: permissionQueryKeys.lookups(),
        queryFn: () => permissionService.getLookup(),
      },
    ],
  })

  // Loading || Error
  const isAnyLoading = queries.some((q) => q.isLoading)
  const isAnyError = queries.some((q) => q.isError)
  const firstError = queries.find((q) => q.error)?.error

  if (isAnyLoading) return
  if (isAnyError && firstError instanceof Error) {
    return <AlertMessage type={AlertType.ERROR} message={firstError.message} />
  }

  // Queries data
  const [peopleQ, rolesQ, permissionsQ] = queries as [
    UseQueryResult<PersonLookupResponse[], Error>,
    UseQueryResult<RoleLookupResponse[], Error>,
    UseQueryResult<PermissionLookupResponse[], Error>
  ]

  // Options
  const peopleOptions: Option[] =
    peopleQ.data?.map((c) => ({
      value: c.id,
      label: c.fullName,
    })) || []

  const rolesOptions: Option[] =
    rolesQ.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  const permissionsOptions: Option[] =
    permissionsQ.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      {schemaKeys.includes("personId") && (
        <Controller
          name={`personId` as Path<T>}
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              isClearable={true}
              fieldState={fieldState}
              options={peopleOptions}
              placeholder="Оберіть людину"
              errorMessage={getNestedErrorMessage(
                errors,
                `personId` as Path<T>
              )}
            />
          )}
        />
      )}

      {schemaKeys.includes("email") && (
        <InputFieldWithError
          label="Email"
          type="email"
          {...register(`email` as Path<T>, formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, `email` as Path<T>)}
        />
      )}

      {schemaKeys.includes("rawPassword") && (
        <InputFieldWithError
          label="Пароль"
          type="password"
          {...register(`rawPassword` as Path<T>, formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, `rawPassword` as Path<T>)}
        />
      )}

      {schemaKeys.includes("isActive") && (
        <CheckboxWithError
          label="Активний"
          {...register(`isActive` as Path<T>, formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, `isActive` as Path<T>)}
        />
      )}

      {schemaKeys.includes("isSuperuser") && (
        <CheckboxWithError
          label="Адміністратор"
          {...register(`isSuperuser` as Path<T>, formTransformers.string)}
          errorMessage={getNestedErrorMessage(errors, `isSuperuser` as Path<T>)}
        />
      )}

      {schemaKeys.includes("rolesIds") && (
        <Controller
          name={`rolesIds` as Path<T>}
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              isMulti={true}
              isClearable={true}
              options={rolesOptions}
              placeholder="Оберіть ролі"
              errorMessage={getNestedErrorMessage(
                errors,
                `rolesIds` as Path<T>
              )}
            />
          )}
        />
      )}

      {schemaKeys.includes("permissionsIds") && (
        <Controller
          name={`permissionsIds` as Path<T>}
          control={control}
          render={({ field, fieldState }) => (
            <FormSelectField
              field={field}
              fieldState={fieldState}
              isMulti={true}
              isClearable={true}
              options={permissionsOptions}
              placeholder="Оберіть права доступу"
              errorMessage={getNestedErrorMessage(
                errors,
                `permissionsIds` as Path<T>
              )}
            />
          )}
        />
      )}

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
