import { ArrowLeft, House, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/app/routes/paths'
import Button from '@/shared/ui/button/Button'

export default function NotAccessPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <Lock className="h-16 w-16 text-red-500" />
      <h1 className="text-2xl font-semibold">Доступ заборонено</h1>
      <p className="max-w-sm">У вас немає прав для перегляду цієї сторінки.</p>
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => void navigate(PATHS.MAIN)}
        >
          <House className="h-5 w-5" /> <span>На головну</span>
        </Button>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
      </div>
    </div>
  )
}
