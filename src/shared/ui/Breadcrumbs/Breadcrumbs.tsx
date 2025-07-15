import { ChevronRight } from 'lucide-react'
import { Link, useMatches, type UIMatch } from 'react-router-dom'
import type { AppRoute } from '@/app/routes/types'

type MatchWithRouteHandle = UIMatch<unknown, { route: AppRoute }>

export function Breadcrumbs() {
  const matches = useMatches() as MatchWithRouteHandle[]

  const crumbs = matches
    // Фильтруем роуты, у которых есть непустой label и он не должен быть скрыт
    .filter((match) => {
      const route = match.handle?.route
      // Убираем роуты без label
      return Boolean(route?.label) && route.path
    })
    // Создаем массив объектов для рендеринга
    .map((match) => {
      const route = match.handle!.route
      return {
        pathname: match.pathname,
        label: route.label,
      }
    })

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 font-medium text-gray-600 dark:text-gray-400">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={crumb.pathname} className="flex items-center">
              <Link
                to={crumb.pathname}
                aria-current={isLast ? 'page' : undefined}
                className={`hover:text-blue-600 ${isLast ? 'pointer-events-none' : ''}`}
              >
                {crumb.label}
              </Link>
              {!isLast && (
                <ChevronRight className="dark:t ml-2 h-4 w-4 flex-shrink-0 text-gray-400" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
