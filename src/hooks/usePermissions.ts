import { useAuth } from "../components/AuthProvider/AuthContext"
import type { Permission } from "../routes/routes"
import type { AppRoute } from "../routes/routes"
import { APP_ROUTES } from "../routes/routes"

export function useUserPermissionNames(): string[] {
  const { currentUser } = useAuth()
  return currentUser?.permissions.map((p) => p.name) ?? []
}

export function useUserPermissionsSet(): Set<string> {
  return new Set(useUserPermissionNames())
}

// Фильтрует список маршрутов, возвращая только те, для которых у пользователя есть все requiredPermissions
export function filterRoutes<T extends { requiredPermissions: Permission[] }>(
  routes: T[],
  perms: Set<string>
): T[] {
  return routes
    .filter((r) => r.requiredPermissions.every((p) => perms.has(p)))
    .map((r) => {
      if (!r.hasOwnProperty("children")) {
        return r
      }
      const withChildren = { ...(r as any) } as T & { children?: T[] }
      withChildren.children = filterRoutes(withChildren.children!, perms)
      return withChildren
    })
}

// Хук-обёртка, сразу отдаёт top-level видимые маршруты
export function useVisibleRoutes(): AppRoute[] {
  const perms = useUserPermissionsSet()
  return filterRoutes(APP_ROUTES, perms)
}
