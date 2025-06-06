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
import { logger } from "../../../../utils/logger"
import { formTransformers } from "../../../../utils/formTransformers"
import { mockPeople } from "../../people/mocks/mock"
import { mockRoles } from "../../roles/mocks/mock"
import { mockPermissions } from "../../permissions/mocks/mock"
import { ZodObject, type z, type ZodType } from "zod"
import { getFieldError } from "../../../../utils/zodHelpers"
import { forwardRef, useImperativeHandle } from "react"
import type { RoleLookupResponse } from "../../roles/types/response.dto"
import { rolesService } from "../../roles/services/service"
import { useQuery } from "@tanstack/react-query"

interface FormProps<T extends ZodType<any, any>> {
  schema: T
  defaultValues?: DefaultValues<z.infer<T>>
  onSubmit: SubmitHandler<z.infer<T>>
  submitBtnName: string
}

function UsersForm<T extends ZodType<any, any>>(
  { schema, defaultValues, onSubmit, submitBtnName }: FormProps<T>,
  ref: React.Ref<{ reset: () => void }>
) {
  const {
    control,
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useImperativeHandle(ref, () => ({
    reset: () => reset(),
  }))

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

  const peopleData = mockPeople
  const peopleOptions = [
    ...peopleData.map((obj) => ({
      value: obj.id,
      label: `${obj.lastName} ${obj.firstName} ${obj.middleName}`,
    })),
  ]

  // const {
  //   data: roleLookupData,
  //   isLoading,
  //   isError,
  //   error: queryError,
  // } = useQuery<RoleLookupResponse[], Error>({
  //   queryKey: ["adminRoleLookupData"],
  //   queryFn: () => rolesService.getLookup(),
  // })

  const rolesData = mockRoles
  const rolesOptions = [
    ...rolesData.map((obj) => ({
      value: obj.id,
      label: obj.name,
    })),
  ]

  const permissionsData = mockPermissions
  const permissionsOptions = [
    ...permissionsData.map((obj) => ({
      value: obj.id,
      label: obj.name,
    })),
  ]

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
              errorMessage={getFieldError(errors.personId)}
            />
          )}
        />
      )}

      {schemaKeys.includes("email") && (
        <InputFieldWithError
          label="Email"
          type="email"
          {...register("email" as Path<T>, formTransformers.string)}
          errorMessage={getFieldError(errors.email)}
        />
      )}

      {schemaKeys.includes("rawPassword") && (
        <InputFieldWithError
          label="Пароль"
          type="password"
          {...register("rawPassword" as Path<T>, formTransformers.string)}
          errorMessage={getFieldError(errors.rawPassword)}
        />
      )}

      {schemaKeys.includes("isActive") && (
        <CheckboxWithError
          label="Активний"
          {...register("isActive" as Path<T>, formTransformers.string)}
          errorMessage={getFieldError(errors.isActive)}
        />
      )}

      {schemaKeys.includes("isSuperuser") && (
        <CheckboxWithError
          label="Адміністратор"
          {...register("isSuperuser" as Path<T>, formTransformers.string)}
          errorMessage={getFieldError(errors.isSuperuser)}
        />
      )}

      {schemaKeys.includes("rolesIds") && (
        <Controller
          name={"rolesIds" as Path<T>}
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
              errorMessage={getFieldError(errors.rolesIds)}
            />
          )}
        />
      )}

      {schemaKeys.includes("permissionsIds") && (
        <Controller
          name={"permissionsIds" as Path<T>}
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
              errorMessage={getFieldError(errors.permissionsIds)}
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

export default forwardRef(UsersForm)
