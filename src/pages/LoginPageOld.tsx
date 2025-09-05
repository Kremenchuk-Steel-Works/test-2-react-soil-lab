import { useAuth } from '@/app/providers/auth/context'
import LoginForm from '@/entities/auth-old/forms/form'
import type { LoginFormFields } from '@/entities/auth-old/forms/schema'

export default function LoginPageOld() {
  const { login } = useAuth()

  const handleSubmit = async (data: LoginFormFields) => {
    await login(data)
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-xl p-8">
          <h4 className="mb-8 text-center text-3xl font-bold">Вхід у систему</h4>
          <LoginForm
            // defaultValues={{
            //   email: 'admin@steel.pl.ua',
            //   password: 'admin4real',
            //   rememberMe: false,
            // }}
            onSubmit={handleSubmit}
            submitBtnName="Вхід"
          />
        </div>
      </div>
    </>
  )
}
