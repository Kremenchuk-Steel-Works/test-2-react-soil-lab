import { compile, match } from 'path-to-regexp'
import { APP_ROUTES } from '@/app/routes/routes'
import type { AppRoute, IndexRoute, NonIndexRoute } from '@/app/routes/types'

/** Является ли маршрут индексным */
export const isIndexRoute = <P = Record<string, never>>(
  route: AppRoute<P>,
): route is IndexRoute<P> => (route as IndexRoute<P>).index === true

export const isNonIndexRoute = <P = Record<string, never>>(
  route: AppRoute<P>,
): route is NonIndexRoute<P> => !isIndexRoute(route)

/** Безопасно получить строку пути (для индексных вернёт '') */
const getRoutePath = (route: AppRoute): string =>
  'path' in route && typeof route.path === 'string' ? route.path : ''

/** Склейка basePath и текущего пути в "чистый" абсолютный путь без лишних слэшей. */
const joinAsFullPath = (basePath: string, currentPath: string): string => {
  const joined = currentPath === '' ? basePath || '/' : `${basePath}/${currentPath}`
  let full = joined.replace(/\/+/g, '/')
  if (full.length > 1 && full.endsWith('/')) full = full.slice(0, -1)
  return full
}

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
    const fullPath = joinAsFullPath(basePath, getRoutePath(route))

    // Создаем матчер, требующий полного совпадения пути (`end: true`).
    const matcher = match(fullPath, { decode: decodeURIComponent, end: true })
    if (matcher(pathname)) return route

    // Если точного совпадения нет, но есть дочерние маршруты, ищем в них.
    if (!isIndexRoute(route) && route.children?.length) {
      const foundChild = findRouteObjectByPath(pathname, route.children, fullPath)
      if (foundChild) return foundChild
    }
  }

  // Ничего не найдено на этом уровне и во всех дочерних
  return undefined
}

/** Принимаем "любой" удобный формат значений параметров */
type ParamsInput = Record<
  string,
  string | number | boolean | null | undefined | Array<string | number | boolean>
>

/** Нормализуем к тому, что ждёт compile(): string | string[] */
function toPathParams(params?: ParamsInput): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {}
  if (!params) return out

  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue
    out[k] = Array.isArray(v) ? v.map(String) : String(v)
  }
  return out
}

/** Ищем маршрут по ключу и возвращаем (route, fullPath) — только среди НЕ индексных роутов */
function findRouteByKey(
  key: string,
  routes: AppRoute[] = APP_ROUTES,
  basePath = '',
): { route: AppRoute; fullPath: string } | undefined {
  for (const route of routes) {
    const fullPath = joinAsFullPath(basePath, getRoutePath(route))

    if (!isIndexRoute(route) && route.key === key) {
      return { route, fullPath }
    }

    if (!isIndexRoute(route) && route.children?.length) {
      const found = findRouteByKey(key, route.children, fullPath)
      if (found) return found
    }
  }
  return undefined
}

/**
 * Возвращает абсолютный путь по ключу роута.
 * Динамические сегменты (:id) подставляются из params.
 */
export function getPathByKey(key: string, params?: ParamsInput): string {
  const found = findRouteByKey(key)
  if (!found) {
    throw new Error(`Route with key "${key}" not found`)
  }
  const toPath = compile(found.fullPath, { encode: encodeURIComponent })
  return toPath(toPathParams(params))
}
