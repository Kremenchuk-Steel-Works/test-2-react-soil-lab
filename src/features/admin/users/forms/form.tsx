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
  ReactSelectWithError,
  ReactSelectMultiWithError,
} from "../../../../components/WithError/fieldsWithError"
import { ZodObject, type z, type ZodType } from "zod"
import { useQueries, type UseQueryResult } from "@tanstack/react-query"
import { rolesService } from "../../roles/services/service"
import { permissionsService } from "../../permissions/services/service"
import { peopleService } from "../../people/services/service"
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
        queryKey: ["adminPersonLookupData"],
        queryFn: () => peopleService.getLookup(),
      },
      {
        queryKey: ["adminRoleLookupData"],
        queryFn: () => rolesService.getLookup(),
      },
      {
        queryKey: ["adminPermissionLookupData"],
        queryFn: () => permissionsService.getLookup(),
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
          render={({ field }) => (
            <ReactSelectWithError
              placeholder="Оберіть людину"
              isClearable={true}
              options={peopleOptions}
              value={
                peopleOptions.find((opt) => opt.value === field.value) ?? null
              }
              onChange={(option) => field.onChange(option?.value)}
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
          render={({ field }) => (
            <ReactSelectMultiWithError
              placeholder="Оберіть ролі"
              isMulti={true}
              isClearable={true}
              options={rolesOptions}
              value={rolesOptions.filter((opt) =>
                field.value?.includes(opt.value)
              )}
              onChange={(selectedOptions) =>
                field.onChange(selectedOptions?.map((opt) => opt.value) || [])
              }
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
          render={({ field }) => (
            <ReactSelectMultiWithError
              placeholder="Оберіть права доступу"
              isMulti={true}
              isClearable={true}
              options={permissionsOptions}
              value={permissionsOptions.filter((opt) =>
                field.value?.includes(opt.value)
              )}
              onChange={(selectedOptions) =>
                field.onChange(selectedOptions?.map((opt) => opt.value) || [])
              }
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
