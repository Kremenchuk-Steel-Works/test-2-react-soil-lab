import type { AppRoute } from '@/app/routes/types'
import { isNonIndexRoute } from '@/app/routes/utils/utils'

/**
 * Рекурсивно ищет НЕ индексный роут по key.
 * Индексные пути пропускаются (у них нет key).
 */
export function findRouteByKey(routes: AppRoute[], key: string): AppRoute | null {
  for (const route of routes) {
    if (isNonIndexRoute(route)) {
      // Проверяем текущий
      if (route.key === key) {
        return route
      }
      // Идём в детей только у неиндексного
      if (route.children?.length) {
        const found = findRouteByKey(route.children, key)
        if (found) return found
      }
    }
  }
  return null
}
