import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes/routes' // 👈 Импортируем наш новый тип
import Button from '@/shared/ui/button/Button'

type DashboardGridProps = {
  parentRouteKey: string
}

export function DashboardGrid({ parentRouteKey }: DashboardGridProps) {
  const navigate = useNavigate()
  const parentRoute = APP_ROUTES.find((route) => route.key === parentRouteKey)

  // Если у найденного роута нет children
  if (!parentRoute?.children) {
    return null
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {parentRoute.children
          .filter((childRoute) => childRoute.children && childRoute.children.length > 0)
          .map((childRoute) => (
            <Button
              key={childRoute.key}
              className="flex items-center justify-center gap-1 whitespace-nowrap"
              onClick={() => navigate(childRoute.path)}
            >
              <childRoute.icon className="h-5 w-5" /> <span>{childRoute.label}</span>
            </Button>
          ))}
      </div>
    </div>
  )
}
