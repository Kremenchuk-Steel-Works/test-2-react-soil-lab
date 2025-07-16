import { useNavigate } from 'react-router-dom'
import { useVisibleRoutes } from '@/shared/hooks/usePermissions'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs'
import Button from '@/shared/ui/button/Button'
import MainLayout from '@/widgets/page-layout/MainLayout'

export default function MainPage() {
  const visibleRoutes = useVisibleRoutes()
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div className="space-y-2">
        <Breadcrumbs />
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {visibleRoutes
            .filter((route) => route.inSidebar !== false)
            .map((route) => (
              <Button
                key={route.key}
                className="flex items-center justify-center gap-1 whitespace-nowrap"
                onClick={() => navigate(route.path)}
              >
                <route.icon className="h-5 w-5" /> <span>{route.label}</span>
              </Button>
            ))}
        </div>
      </div>
    </MainLayout>
  )
}
