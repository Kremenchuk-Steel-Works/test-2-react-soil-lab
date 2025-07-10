import { match } from 'path-to-regexp'
import { APP_ROUTES } from '@/app/routes/routes'
import type { AppRoute } from '@/app/routes/types'

/**
 * Рекурсивно находит объект маршрута, соответствующий указанному URL-пути.
 * Корректно обрабатывает вложенные маршруты, динамические сегменты (e.g., :id)
 * и игнорирует query-параметры.
 *
 * @param pathname - URL-путь для поиска (e.g., location.pathname).
 * @param routes - Массив маршрутов для поиска (по умолчанию - все маршруты приложения).
 * @param basePath - Базовый путь для рекурсивных вызовов (используется внутренне).
 * @returns {AppRoute | undefined} - Найденный объект маршрута или undefined.
 */
export function findRouteObjectByPath(
  pathname: string,
  routes: AppRoute[] = APP_ROUTES,
  basePath = '',
): AppRoute | undefined {
  for (const route of routes) {
    // Собираем полный путь, учитывая вложенность.
    const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, '/')

    // Создаем матчер, требующий полного совпадения пути (`end: true`).
    const matcher = match(fullPath, { decode: decodeURIComponent, end: true })
    const matchResult = matcher(pathname)

    if (matchResult) {
      return route
    }

    // Если точного совпадения нет, но есть дочерние маршруты, ищем в них.
    if (route.children && route.children.length > 0) {
      const foundChild = findRouteObjectByPath(pathname, route.children, fullPath)
      if (foundChild) {
        return foundChild
      }
    }
  }

  // Ничего не найдено на этом уровне и во всех дочерних
  return undefined
}
