import Login from '@/features/auth/login/ui/Login'

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-xl p-8">
          <h4 className="mb-8 text-center text-3xl font-bold">Вхід у систему</h4>
          <Login />
        </div>
      </div>
    </>
  )
}
