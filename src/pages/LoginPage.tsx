import LoginForm from "../entities/auth/forms/form"
import type { LoginFormFields } from "../entities/auth/forms/schema"
import { useAuth } from "../app/providers/auth/model"

export default function AdminDepartmentsAdd() {
  const { login } = useAuth()

  const handleSubmit = async (data: LoginFormFields) => {
    await login(data)
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl">
          <h4 className="text-3xl font-bold text-center mb-8">
            Вхід у систему
          </h4>
          <LoginForm
            defaultValues={{
              email: "admin@steel.pl.ua",
              password: "admin4real",
              rememberMe: false,
            }}
            onSubmit={handleSubmit}
            submitBtnName="Вхід"
          />
        </div>
      </div>
    </>
  )
}
