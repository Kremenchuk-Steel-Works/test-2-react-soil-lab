import Button from "../components/Button/Button"
import Layout from "../components/Template/Layout"
import { useAuth } from "../components/AuthProvider/AuthContext"
import log from "../utils/logger"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../routes/AppRoutes"

export default function MainPage() {
  const { currentUser } = useAuth()
  const accessPages = getAccessPages()
  const navigate = useNavigate()
  log.debug(accessPages)

  function getAccessPages() {
    const pages = []

    for (const page of currentUser?.permissions ?? []) {
      if (page.name.includes("_view")) {
        const pageCopy = { ...page }
        pageCopy.name = page.name.split("_view")[0]
        pages.push(pageCopy)
      }
    }
    return pages
  }

  return (
    <Layout>
      <div className="space-y-2">
        <h4 className="layout-text">Головна сторінка</h4>
        <div className="flex flex-wrap space-x-2">
          {getAccessPages().map((p) => (
            <Button
              key={p.name}
              onClick={() => navigate(PATHS.SPECTRAL_ANALYSIS)}
            >
              {p.description}
            </Button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
