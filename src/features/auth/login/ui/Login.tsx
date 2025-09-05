import { useAuth } from '@/app/providers/auth/context'
import { loginFormDefaultValues, type LoginFormFields } from '@/features/auth/login/model/schema'
import { LoginForm } from '@/features/auth/login/ui/LoginForm'

export default function Login() {
  const { login } = useAuth()

  const handleSubmit = async (data: LoginFormFields) => {
    await login(data)
    return data
  }

  return (
    <LoginForm
      defaultValues={loginFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}
