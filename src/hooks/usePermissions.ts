import { useAuth } from "../components/AuthProvider/AuthContext"
import type { AppRoute } from "../routes/routes"
import { APP_ROUTES } from "../routes/routes"

export function useUserPermissionNames(): string[] {
  const { currentUser } = useAuth()
  return currentUser?.permissions.map((p) => p.name) ?? []
}

export function useUserPermissionsSet(): Set<string> {
  return new Set(useUserPermissionNames())
}

// Рекурсивно фильтрует массив маршрутов, оставляя только те, у которых нет requiredPermissions или у пользователя есть все нужные права
export function filterRoutes(
  routes: AppRoute[],
  perms: Set<string>
): AppRoute[] {
  return routes
    .filter((r) =>
      // если нет requiredPermissions - считаем маршрут открытым
      (r.requiredPermissions ?? []).every((p) => perms.has(p))
    )
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
  const perms = useUserPermissionsSet()
  return filterRoutes(APP_ROUTES, perms)
}
