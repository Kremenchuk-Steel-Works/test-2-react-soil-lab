import {
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from "react-hook-form"
import { z, ZodSchema } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ButtonWithError,
  InputFieldWithError,
} from "../WithError/fieldsWithError"
import { forwardRef, useImperativeHandle } from "react"
import { logger } from "../../lib/logger"

export const userSchemaOld = z.object({
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

export type UserFormFieldsOld = z.infer<typeof userSchemaOld>

export interface UserFormProps<T> {
  defaultValues?: DefaultValues<T>
  onSubmit: SubmitHandler<T>
  submitBtnName: string
  showPasswordField?: boolean
  schema: ZodSchema<T>
}

function UserFormOld<T extends UserFormFieldsOld = UserFormFieldsOld>(
  {
    defaultValues,
    onSubmit,

    submitBtnName,
    schema,
    showPasswordField = true,
  }: UserFormProps<T>,
  ref: React.Ref<{ reset: () => void }>
) {
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  })

  // 👇 expose reset to parent via ref
  useImperativeHandle(ref, () => ({
    reset: () => reset(),
  }))

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

const UserForm = forwardRef(UserFormOld) as <T>(
  props: UserFormProps<T> & { ref?: React.Ref<{ reset: () => void }> }
) => ReturnType<typeof UserFormOld>

export default UserForm
