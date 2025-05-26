import { useForm, type SubmitHandler } from "react-hook-form"
import { z, ZodSchema } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ButtonWithError,
  InputFieldWithError,
} from "../WithError/fieldsWithError"
import { logger } from "../../utils/logger"

export const userSchema = z.object({
  email: z.string().email(),
  raw_password: z.string().min(4),
  profile: z.object({
    first_name: z.string().nonempty(),
    last_name: z.string().nonempty(),
    employee_number: z
      .string()
      .nonempty()
      .regex(/^\d+$/, { message: "Тільки цифри" }),
  }),
})

export type UserFormFields = z.infer<typeof userSchema>

export interface UserFormProps<T> {
  defaultValues?: Partial<UserFormFields>
  onSubmit: SubmitHandler<T>
  submitBtnName: string
  showPasswordField?: boolean
  schema: ZodSchema<T>
}

export function UserForm<T extends Partial<UserFormFields> = UserFormFields>({
  defaultValues,
  onSubmit,
  submitBtnName,
  schema,
  showPasswordField = true,
}: UserFormProps<T>) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
  })

  const submitHandler: SubmitHandler<T> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug("Форма успешно выполнена", response)
    } catch (err: any) {
      setError("root" as any, { message: err.message })
      logger.error(err)
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <div className="space-y-2">
        <InputFieldWithError
          label="Email"
          errorMessage={(errors as any).email?.message}
          {...register("email" as any)}
        />
      </div>

      {showPasswordField && (
        <div className="space-y-2">
          <InputFieldWithError
            label="Пароль"
            type="password"
            errorMessage={(errors as any).raw_password?.message}
            {...register("raw_password" as any)}
          />
        </div>
      )}

      <h4 className="layout-text">Профіль</h4>

      <div className="space-y-2">
        <InputFieldWithError
          label="Им'я"
          errorMessage={(errors as any).profile?.first_name?.message}
          {...register("profile.first_name" as any)}
        />
      </div>

      <div className="space-y-2">
        <InputFieldWithError
          label="Прізвище"
          errorMessage={(errors as any).profile?.last_name?.message}
          {...register("profile.last_name" as any)}
        />
      </div>

      <div className="space-y-2">
        <InputFieldWithError
          label="Номер працівника"
          inputMode="numeric"
          type="number"
          errorMessage={(errors as any).profile?.employee_number?.message}
          {...register("profile.employee_number" as any)}
        />
      </div>

      <div className="space-y-2">
        <ButtonWithError
          className="w-full"
          type="submit"
          errorMessage={(errors as any).root?.message}
          disabled={isSubmitting}
        >
          {submitBtnName}
        </ButtonWithError>
      </div>
    </form>
  )
}
