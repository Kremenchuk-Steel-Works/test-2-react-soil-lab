import { ArrowLeft } from "lucide-react"
import Button from "../shared/ui/Button/Button"
import Layout from "../widgets/PageLayout/Layout"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../app/routes/AppRoutes"

export default function SteamlitPage() {
  const navigate = useNavigate()
  return (
    <Layout>
      <div className="space-y-2">
        <h4 className="layout-text">Quality Dash</h4>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate(PATHS.MAIN)}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
        <div className="w-full h-full block">
          <iframe
            src="http://195.189.63.125:8501"
            width="100%"
            height="900px"
          />
        </div>
      </div>
    </Layout>
  )
}
