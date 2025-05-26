import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  SelectWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { userSchema, type UserFormFields } from "./schema"
import { logger } from "../../../../utils/logger"

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
    register,
    handleSubmit,
    control,
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

  const activeOptions = [
    { value: true, label: "Активний" },
    { value: false, label: "Неактивний" },
  ]

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Людина ID"
        errorMessage={errors.personId?.message}
        {...register("personId")}
      />

      <InputFieldWithError
        label="Email"
        type="email"
        errorMessage={errors.email?.message}
        {...register("email")}
      />

      <InputFieldWithError
        label="Пароль"
        type="password"
        errorMessage={errors.password?.message}
        {...register("password")}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <SelectWithError
            className="w-full"
            heightClass="py-3.5"
            placeholder="Оберіть статус"
            isClearable={true}
            options={activeOptions}
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.isActive?.message}
          />
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть статус"
            isClearable={true}
            options={activeOptions}
            value={activeOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={errors.isActive?.message}
          />
        )}
      />

      <div className="space-y-3">
        <h4 className="layout-text">Роль</h4>

        <InputFieldWithError
          label="Роль ID"
          errorMessage={errors.roles?.roleId?.message}
          {...register("roles.roleId")}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Права доступу</h4>

        <InputFieldWithError
          label="Права доступу ID"
          errorMessage={errors.permissions?.permissionId?.message}
          {...register("permissions.permissionId")}
        />
      </div>

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
