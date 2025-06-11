import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormFields } from "./schema"
import { logger } from "../../../utils/logger"
import {
  ButtonWithError,
  CheckboxWithError,
  InputFieldWithError,
} from "../../../components/WithError/fieldsWithError"
import { formTransformers } from "../../../utils/formTransformers"

type FormFields = LoginFormFields
const schema = loginSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function LoginForm({
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
        label="Email"
        errorMessage={errors.email?.message}
        {...register("email")}
      />

      <InputFieldWithError
        label="Пароль"
        type="password"
        errorMessage={errors.password?.message}
        {...register("password")}
      />

      <CheckboxWithError
        label="Запам'ятати мене"
        {...register(`rememberMe`, formTransformers.string)}
        errorMessage={errors.rememberMe?.message}
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
