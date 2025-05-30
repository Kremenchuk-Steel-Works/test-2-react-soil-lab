import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  CheckboxWithError,
} from "../../../../components/WithError/fieldsWithError"
import { userSchema, type UserFormFields } from "./schema"
import { logger } from "../../../../utils/logger"
import { formTransformers } from "../../../../utils/formTransformers"

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

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Людина ID"
        errorMessage={errors.personId?.message}
        {...register("personId", formTransformers.string)}
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

      <div className="space-y-3">
        <h4 className="layout-text">Роль</h4>

        <InputFieldWithError
          label="Роль ID"
          errorMessage={errors.rolesIds?.message}
          {...register("rolesIds", formTransformers.string)}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Права доступу</h4>

        <InputFieldWithError
          label="Права доступу ID"
          errorMessage={errors.permissionsIds?.message}
          {...register("permissionsIds", formTransformers.string)}
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
