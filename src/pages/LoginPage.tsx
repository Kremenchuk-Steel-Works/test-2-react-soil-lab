import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import InputFieldWithError from "../components/InputField/InputFieldWithError"
import ButtonWithError from "../components/Button/ButtonWithError"
import { useAuth } from "../components/AuthProvider/AuthContext"
import log from "../utils/logger"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  rememberMe: z.boolean(),
})

export type FormLoginFields = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormLoginFields>({
    defaultValues: {
      email: "admin@example.com",
      password: "1111",
      rememberMe: false,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormLoginFields> = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })

      log.debug("Авторизация прошла успешно")
    } catch (err) {
      const error = err as Error
      setError("root", { message: `${error.message}` })
      log.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl">
        <h4 className="text-3xl font-bold text-center mb-8">Вхід у систему</h4>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <InputFieldWithError
              label="Email"
              errorMessage={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <InputFieldWithError
              label="Пароль"
              type="password"
              errorMessage={errors.password?.message}
              {...register("password")}
            />
          </div>

          <label className="flex items-center space-x-2 cursor-pointer select-none text-sm">
            <input
              type="checkbox"
              className="h-5 w-5 border rounded-md focus:ring-0 transition cursor-pointer"
              {...register("rememberMe")}
            />
            <span>Запам'ятати мене</span>
          </label>

          <div className="space-y-2">
            <ButtonWithError
              className="w-full"
              type="submit"
              errorMessage={errors.root?.message}
              disabled={isSubmitting}
            >
              Вхід
            </ButtonWithError>
          </div>
        </form>
      </div>
    </div>
  )
}
