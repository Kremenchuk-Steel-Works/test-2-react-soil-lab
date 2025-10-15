import { useNavigate } from 'react-router-dom'
import type { RouteKey } from '@/app/routes/types'
import { isNonIndexRoute } from '@/app/routes/utils/utils'
import { useVisibleRoutes } from '@/shared/hooks/usePermissions'
import Button from '@/shared/ui/button/Button'
import { EllipsisTextInline } from '@/shared/ui/ellipsis/EllipsisTextInline'
import { findRouteByKey } from '@/utils/routes/routeUtils'
import RouteTableView from '@/widgets/page/RouteTableView'

type DashboardGridProps = {
  parentRouteKey: RouteKey
  variant?: 'buttons' | 'table'
}

export function DashboardGrid({ parentRouteKey, variant = 'buttons' }: DashboardGridProps) {
  const navigate = useNavigate()
  const visibleRoutes = useVisibleRoutes()
  const parentRoute = findRouteByKey(visibleRoutes, parentRouteKey)

  if (!parentRoute?.children) return null

  // Вариант с таблицей
  if (variant === 'table') {
    return <RouteTableView parentRouteKey={parentRouteKey} />
  }

  const visibleChildren = parentRoute.children.filter(
    (child) => Array.isArray(child.children) && child.children.length > 0,
  )

  if (visibleChildren.length === 0) return null

  // Вариант с кнопками
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {visibleChildren
          .filter(isNonIndexRoute)
          .filter((route) => route.inSidebar !== false)
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
