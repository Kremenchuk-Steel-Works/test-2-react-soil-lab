import Button from "../components/Button/Button"
import Layout from "../components/Template/Layout"
import useAccessPages from "../hooks/useAccessPages"
import log from "../utils/logger"
import { useNavigate } from "react-router-dom"

export default function MainPage() {
  const accessPages = useAccessPages()
  const navigate = useNavigate()
  log.debug(accessPages)

  return (
    <Layout>
      <div className="space-y-2">
        <h4 className="layout-text">Головна сторінка</h4>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {accessPages.map((p) => (
            <Button key={p.name} onClick={() => navigate(p.name)}>
              {p.description}
            </Button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
