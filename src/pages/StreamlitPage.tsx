import { ArrowLeft } from "lucide-react"
import Button from "../components/Button/Button"
import Layout from "../components/Template/Layout"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../routes/AppRoutes"

export default function SteamlitPage() {
  const navigate = useNavigate()
  return (
    <Layout>
      <div className="space-y-2">
        <h4 className="layout-text">Streamlit</h4>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate(PATHS.MAIN)}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
        <div className="flex flex-wrap space-x-2">
          <iframe
            src="http://195.189.63.125:8555"
            width="100%"
            height="700px"
          />
        </div>
      </div>
    </Layout>
  )
}
