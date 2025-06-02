import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  CheckboxWithError,
  ReactSelectWithError,
  ReactSelectMultiWithError,
} from "../../../../components/WithError/fieldsWithError"
import { userSchema, type UserFormFields } from "./schema"
import { logger } from "../../../../utils/logger"
import { formTransformers } from "../../../../utils/formTransformers"
import { mockPeople } from "../../people/mocks/mock"
import { mockRoles } from "../../roles/mocks/mock"
import { mockPermissions } from "../../permissions/mocks/mock"

type FormFields = UserFormFields
const schema = userSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function UsersForm({
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

  const peopleData = mockPeople
  const peopleOptions = [
    ...peopleData.map((obj) => ({
      value: obj.id,
      label: `${obj.lastName} ${obj.firstName} ${obj.middleName}`,
    })),
  ]

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
      <Controller
        name={`personId`}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть людину"
            isClearable={true}
            options={peopleOptions}
            value={peopleOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={errors.personId?.message}
          />
        )}
      />

      <InputFieldWithError
        label="Email"
        type="email"
        errorMessage={errors.email?.message}
        {...register("email", formTransformers.string)}
      />

      <InputFieldWithError
        label="Пароль"
        type="password"
        errorMessage={errors.rawPassword?.message}
        {...register("rawPassword", formTransformers.string)}
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
