import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  CheckboxWithError,
  ReactSelectMultiWithError,
} from "../../../../components/WithError/fieldsWithError"
import { updateUserSchema, type UpdateUserFormFields } from "./schema"
import { logger } from "../../../../utils/logger"
import { formTransformers } from "../../../../utils/formTransformers"
import { mockRoles } from "../../roles/mocks/mock"
import { mockPermissions } from "../../permissions/mocks/mock"

type FormFields = UpdateUserFormFields
const schema = updateUserSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function UpdateUsersForm({
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
      <InputFieldWithError
        label="Email"
        type="email"
        errorMessage={errors.email?.message}
        {...register("email", formTransformers.string)}
      />

      <CheckboxWithError
        label="Активний"
        {...register("isActive", formTransformers.string)}
        errorMessage={errors.isActive?.message}
      />

      <CheckboxWithError
        label="Адміністратор"
        {...register("isSuperuser", formTransformers.string)}
        errorMessage={errors.isSuperuser?.message}
      />

      <Controller
        name="rolesIds"
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
            errorMessage={errors.rolesIds?.message}
          />
        )}
      />

      <Controller
        name="permissionsIds"
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
            errorMessage={errors.permissionsIds?.message}
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
