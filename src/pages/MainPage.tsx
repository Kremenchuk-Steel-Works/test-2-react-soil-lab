import Button from "../shared/ui/button/Button"
import Layout from "../widgets/page-layout/Layout"
import { useNavigate } from "react-router-dom"
import { useVisibleRoutes } from "../shared/hooks/usePermissions"

export default function MainPage() {
  const visibleRoutes = useVisibleRoutes()
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="space-y-2">
        <h4 className="layout-text">Головна сторінка</h4>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {visibleRoutes
            .filter((route) => route.inSidebar !== false)
            .map((route) => (
              <Button
                key={route.key}
                className="flex items-center justify-center gap-1 whitespace-nowrap"
                onClick={() => navigate(route.path)}
              >
                <route.icon className="w-5 h-5" /> <span>{route.label}</span>
              </Button>
            ))}
        </div>
      </div>
    </Layout>
  )
}
