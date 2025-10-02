import { ChevronRight } from 'lucide-react'
import { Link, useMatches, type UIMatch } from 'react-router-dom'
import type { AppRoute } from '@/app/routes/types'

type MatchWithRouteHandle = UIMatch<unknown, { route: AppRoute }>
type Crumb = { pathname: string; label: string }

// Обрезаем по ближайшему пробелу <= max; не добавляем "…" — это сделает CSS truncate при переполнении
function trimByWord(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()
}

// Делим общий бюджет между предпоследним и последним по их долям длины, с минимальными порогами
function allocateMobile(prev: string, last: string) {
  const TOTAL = 35
  const MIN_PREV = 10
  const MIN_LAST = 12

  const Lp = prev.length
  const Ll = last.length
  const sum = Lp + Ll

  if (sum <= TOTAL) return { prev, last }

  // Пропорционально делим бюджет и придерживаемся минимумов
  let prevMax = Math.round((Lp / sum) * TOTAL)
  prevMax = Math.min(Math.max(prevMax, MIN_PREV), TOTAL - MIN_LAST)
  const lastMax = TOTAL - prevMax

  return {
    prev: trimByWord(prev, prevMax),
    last: trimByWord(last, lastMax),
  }
}

export function Breadcrumbs() {
  const matches = useMatches() as MatchWithRouteHandle[]

  const crumbs: Crumb[] = matches
    .filter((m) => {
      const route = m.handle?.route
      return Boolean(route?.label) && Boolean(route?.path)
    })
    .map((m) => {
      const route = m.handle.route
      return { pathname: m.pathname, label: route.label }
    })

  const len = crumbs.length
  const lastCrumb = crumbs[len - 1]
  const prevCrumb = crumbs[len - 2]

  // Готовим мобильные версии двух последних заранее
  const mobileText =
    prevCrumb && lastCrumb
      ? allocateMobile(prevCrumb.label, lastCrumb.label)
      : { prev: prevCrumb?.label ?? '', last: lastCrumb?.label ?? '' }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-0.5 text-base font-medium text-gray-600 dark:text-gray-400">
        {/* Мобильный префикс "…" если скрываем начало */}
        {len > 2 && (
          <li className="flex items-center md:hidden">
            <span className="text-gray-400" aria-hidden>
              …
            </span>
            <ChevronRight className="ml-0.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden />
          </li>
        )}

        {crumbs.map((crumb, index) => {
          const isLast = index === len - 1
          const isPenultimate = index === len - 2
          const showOnMobile = isLast || isPenultimate

          // Берём предрасчитанные мобильные строки
          const mobileLabel = isLast ? mobileText.last : isPenultimate ? mobileText.prev : ''

          return (
            <li
              key={crumb.pathname}
              className={`items-center ${showOnMobile ? 'flex' : 'hidden md:flex'}`}
            >
              <Link
                to={crumb.pathname}
                aria-current={isLast ? 'page' : undefined}
                className={`link-hover ${isLast ? 'pointer-events-none text-gray-800 dark:text-gray-200' : ''}`}
                title={crumb.label}
              >
                {/* Мобилка: показываем оптимизированный по словам текст + подстраховка truncate */}
                <span className="block truncate md:hidden">{mobileLabel}</span>
                {/* Десктоп: исходный текст без обрезки */}
                <span className="hidden md:inline">{crumb.label}</span>
              </Link>

              {!isLast && <ChevronRight className="ml-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
