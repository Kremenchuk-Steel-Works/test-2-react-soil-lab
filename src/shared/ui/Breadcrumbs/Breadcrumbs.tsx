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
      const route = match.handle.route
      return {
        pathname: match.pathname,
        label: route.label,
      }
    })

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-0.5 text-base font-medium text-gray-600 dark:text-gray-400">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            // Оборачиваем li в React.Fragment для корректной работы key и условного рендеринга
            <li
              key={crumb.pathname}
              // - Элемент скрыт по умолчанию (`hidden`)
              // - На экранах `md` (768px) и больше он становится flex-контейнером (`md:flex`)
              // - Последний элемент (`isLast`) всегда виден, т.к. мы не применяем к нему `hidden`
              className={`items-center ${!isLast ? 'hidden md:flex' : 'flex'}`}
            >
              <Link
                to={crumb.pathname}
                aria-current={isLast ? 'page' : undefined}
                className={`hover:text-blue-600 ${isLast ? 'pointer-events-none text-gray-800 dark:text-gray-200' : ''}`}
              >
                {crumb.label}
              </Link>
              {/* Разделитель также будет скрыт вместе с `li` на мобильных */}
              {!isLast && <ChevronRight className="ml-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
