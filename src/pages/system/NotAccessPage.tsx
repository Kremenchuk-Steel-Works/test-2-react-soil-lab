import { useNavigate } from "react-router-dom"
import { ArrowLeft, House, Lock } from "lucide-react"
import Button from '@/shared/ui/button/Button'
import { PATHS } from '@/app/routes/AppRoutes'

export default function NotAccessPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
      <Lock className="h-16 w-16 text-red-500" />
      <h1 className="text-2xl font-semibold">Доступ заборонено</h1>
      <p className="max-w-sm">У вас немає прав для перегляду цієї сторінки.</p>
      <div className="flex justify-center items-center space-x-2">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate(PATHS.MAIN)}
        >
          <House className="w-5 h-5" /> <span>На головну</span>
        </Button>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
      </div>
    </div>
  )
}
