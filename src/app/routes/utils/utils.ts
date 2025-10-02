import { compile, match } from 'path-to-regexp'
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
    if (v == null) continue // пропускаем undefined/null, пусть compile валидирует обязательные
    if (Array.isArray(v)) {
      out[k] = v.map((x) => String(x))
    } else {
      out[k] = String(v)
    }
  }
  return out
}

/** Ищем маршрут по ключу и возвращаем (route, fullPath) */
function findRouteByKey(
  key: string,
  routes: AppRoute[] = APP_ROUTES,
  basePath = '',
): { route: AppRoute; fullPath: string } | undefined {
  for (const route of routes) {
    const fullPath =
      route.path === '' ? basePath || '/' : `${basePath}/${route.path}`.replace(/\/+/g, '/')

    if (route.key === key) return { route, fullPath }

    if (route.children?.length) {
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
