import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes/routes'
import Button from '@/shared/ui/button/Button'
import { EllipsisTextInline } from '@/shared/ui/ellipsis/EllipsisTextInline'
import { findRouteByKey } from '@/utils/routes/routeUtils'
import RouteTableView from '@/widgets/page/RouteTableView'

type DashboardGridProps = {
  parentRouteKey: string
  variant?: 'buttons' | 'table'
}

export function DashboardGrid({ parentRouteKey, variant = 'buttons' }: DashboardGridProps) {
  const navigate = useNavigate()
  const parentRoute = findRouteByKey(APP_ROUTES, parentRouteKey)

  if (!parentRoute?.children) return null

  // Вариант с таблицей
  if (variant === 'table') {
    return <RouteTableView parentRouteKey={parentRouteKey} />
  }

  // Вариант с кнопками
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {parentRoute.children
          .filter((childRoute) => childRoute.children && childRoute.children.length > 0)
          .map((childRoute) => (
            <Button
              key={childRoute.key}
              className="flex max-w-85 items-center justify-center gap-1 whitespace-nowrap"
              onClick={() => void navigate(childRoute.path)}
              aria-label={childRoute.label}
            >
              <childRoute.icon className="h-5 w-5 flex-shrink-0" />
              <EllipsisTextInline title={childRoute.label}>{childRoute.label}</EllipsisTextInline>
            </Button>
          ))}
      </div>
    </div>
  )
}
