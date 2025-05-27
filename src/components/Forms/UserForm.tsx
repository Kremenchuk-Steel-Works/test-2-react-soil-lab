import { useForm, type SubmitHandler } from "react-hook-form"
import { z, ZodSchema } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ButtonWithError,
  InputFieldWithError,
} from "../WithError/fieldsWithError"
import { logger } from "../../utils/logger"

export const userSchema2 = z.object({
  email: z.string().email(),
  rawPassword: z.string().min(4),
  profile: z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    employeeNumber: z
      .string()
      .nonempty()
      .regex(/^\d+$/, { message: "Тільки цифри" }),
  }),
})

export type UserFormFields2 = z.infer<typeof userSchema2>

export interface UserFormProps<T> {
  defaultValues?: Partial<UserFormFields2>
  onSubmit: SubmitHandler<T>
  submitBtnName: string
  showPasswordField?: boolean
  schema: ZodSchema<T>
}

export function UserForm2<
  T extends Partial<UserFormFields2> = UserFormFields2
>({
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
            errorMessage={(errors as any).rawPassword?.message}
            {...register("rawPassword" as any)}
          />
        </div>
      )}

      <h4 className="layout-text">Профіль</h4>

      <div className="space-y-2">
        <InputFieldWithError
          label="Им'я"
          errorMessage={(errors as any).profile?.firstName?.message}
          {...register("profile.firstName" as any)}
        />
      </div>

      <div className="space-y-2">
        <InputFieldWithError
          label="Прізвище"
          errorMessage={(errors as any).profile?.lastName?.message}
          {...register("profile.lastName" as any)}
        />
      </div>

      <div className="space-y-2">
        <InputFieldWithError
          label="Номер працівника"
          inputMode="numeric"
          type="number"
          errorMessage={(errors as any).profile?.employeeNumber?.message}
          {...register("profile.employeeNumber" as any)}
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
