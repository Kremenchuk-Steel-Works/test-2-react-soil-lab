import { useNavigate } from "react-router-dom"
import { ArrowLeft, House, Lock } from "lucide-react"
import Button from "../../components/Button/Button"
import { PATHS } from "../../routes/AppRoutes"

export default function NotAccessPage() {
  const navigate = useNavigate()

  return (
    // этот контейнер займёт всю высоту main и выровняет содержимое по центру
    <div className="min-h-full flex items-center justify-center">
      {/* сама “карточка” */}
      <div
        className="
          w-full max-w-md
          flex flex-col items-center justify-center space-y-4
          bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white
        "
      >
        <Lock className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-semibold">Доступ заборонено</h1>
        <p className="max-w-sm">
          У вас немає прав для перегляду цієї сторінки.
        </p>
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
    </div>
  )
}
