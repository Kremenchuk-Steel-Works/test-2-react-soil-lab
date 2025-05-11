import Button from "../../components/Button/Button"
// import { useAuth } from "../../components/AuthProvider/AuthContext"
// import log from "../../utils/logger"
import { useNavigate } from "react-router-dom"
// import { PATHS } from "../../routes/AppRoutes"
import { ArrowLeft } from "lucide-react"

export default function SpectralAnalysisAdd() {
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center">
      <Button
        className="flex items-center justify-center gap-1 whitespace-nowrap"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
      </Button>
    </div>
  )
}
