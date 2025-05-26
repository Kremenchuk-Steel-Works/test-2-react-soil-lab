import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  SelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { updateUserSchema, type UpdateUserFormFields } from "./schema"
import { logger } from "../../../../utils/logger"

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
            options={[
              { value: true, label: "Активний" },
              { value: false, label: "Неактивний" },
            ]}
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.isActive?.message}
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
