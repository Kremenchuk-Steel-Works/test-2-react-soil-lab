import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth/model'
import { APP_ROUTES } from '@/app/routes/routes'
import type { AppRoute } from '@/app/routes/types'
import { findRouteObjectByPath } from '@/app/routes/utils'
import type { UserResponse } from '@/entities/admin/users/types/response.dto'

export function useUserPermissionNames(): string[] {
  const { currentUser } = useAuth()
  return currentUser?.permissions.map((p) => p.name) ?? []
}

export function useUserPermissionsSet(): Set<string> {
  return new Set(useUserPermissionNames())
}

/**
 * Чистая функция, проверяющая доступ к пути на основе данных пользователя и его прав.
 * Не является хуком.
 * @param path - Путь для проверки.
 * @param user - Объект текущего пользователя.
 * @param permissions - Set с правами пользователя.
 * @returns {boolean} - true, если доступ разрешен.
 */
function checkAccessLogic(
  path: string,
  user: UserResponse | null | undefined,
  permissions: Set<string>,
): boolean {
  // Суперпользователь имеет доступ ко всему
  if (user?.isSuperuser) {
    return true
  }

  // Находим объект маршрута
  const route = findRouteObjectByPath(path, APP_ROUTES)

  // Если маршрут не описан, доступа нет
  if (!route) {
    return false
  }

  //  Если права не требуются, доступ есть
  const requiredPermissions = route.requiredPermissions
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }

  // Проверяем наличие хотя бы одного из требуемых прав
  return requiredPermissions.some((p) => permissions.has(p))
}

/**
 * Хук для проверки, имеет ли пользователь доступ к произвольному пути.
 * Получает данные из React-контекста и вызывает чистую логику проверки.
 * @param path - Путь для проверки.
 * @returns {boolean}
 */
export function useCanAccessPath(path: string): boolean {
  const { currentUser } = useAuth()
  const userPermissions = useUserPermissionsSet()

  // Мемоизация остается, но теперь она оборачивает вызов единой функции
  return useMemo(
    () => checkAccessLogic(path, currentUser, userPermissions),
    [path, currentUser, userPermissions],
  )
}

/**
 * Хук-обертка для проверки доступа к ТЕКУЩЕМУ маршруту.
 * Просто использует useCanAccessPath для всей логики.
 * @returns {boolean}
 */
export function useHasAccessToCurrentRoute(): boolean {
  const { pathname } = useLocation()
  return useCanAccessPath(pathname)
}

// Рекурсивно фильтрует массив маршрутов, оставляя только те, у которых нет requiredPermissions или у пользователя есть все нужные права
export function filterRoutes(
  routes: AppRoute[],
  perms: Set<string>,
  isSuperuser = false,
): AppRoute[] {
  return routes
    .filter((r) => {
      // isAdmin
      if (isSuperuser) return true

      const required = r.requiredPermissions ?? []
      if (!required || required.length === 0) return true
      return required.some((p) => perms.has(p))
    })
    .map((r) => {
      // если нет дочерних маршрутов - возвращаем сам объект
      if (!r.children || r.children.length === 0) {
        return r
      }
      // иначе рекурсивно фильтруем children и возвращаем новый объект
      return {
        ...r,
        children: filterRoutes(r.children, perms),
      }
    })
}

// Хук-обёртка, сразу отдаёт top-level видимые маршруты
export function useVisibleRoutes(): AppRoute[] {
  const { currentUser } = useAuth()
  const perms = useUserPermissionsSet()
  return filterRoutes(APP_ROUTES, perms, currentUser?.isSuperuser)
}
