import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth/context'
import type { Permission } from '@/app/routes/permissions'
import { APP_ROUTES } from '@/app/routes/routes'
import type { AppRoute, PageAction } from '@/app/routes/types'
import { findRouteObjectByPath } from '@/app/routes/utils/utils'
import type { UserDetailResponse } from '@/shared/api/soil-lab/model'

export function useUserPermissionNames(): string[] {
  const { currentUser } = useAuth()
  return currentUser?.permissions.map((p) => p.code) ?? []
}

export function useUserPermissionsSet(): Set<string> {
  return new Set(useUserPermissionNames())
}

/**
 * Функция, проверяющая доступ к пути на основе данных пользователя и его прав.
 * Не является хуком.
 * @param path - Путь для проверки.
 * @param user - Объект текущего пользователя.
 * @param permissions - Set с правами пользователя.
 * @returns {boolean} - true, если доступ разрешен.
 */
export function checkAccessLogic(
  path: string,
  user: UserDetailResponse | null | undefined,
  permissions: Set<string>,
): boolean {
  // Находим объект маршрута
  const route = findRouteObjectByPath(path, APP_ROUTES)

  // Если маршрут не описан, доступа нет
  if (!route) {
    return false
  }

  // Суперпользователь имеет доступ ко всему
  if (user?.isSuperuser) {
    return true
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
        children: filterRoutes(r.children, perms, isSuperuser),
      }
    })
}

// Хук-обёртка, сразу отдаёт top-level видимые маршруты
export function useVisibleRoutes(): AppRoute[] {
  const { currentUser } = useAuth()
  const perms = useUserPermissionsSet()
  return filterRoutes(APP_ROUTES, perms, currentUser?.isSuperuser)
}

// Can access for meta logic
/**
 * Возвращает объект текущего роута по pathname.
 * Легковесный селектор поверх APP_ROUTES.
 */
export function useCurrentRoute(): AppRoute | undefined {
  const { pathname } = useLocation()
  // findRouteObjectByPath уже достаточно дешёвый, доп. мемоизация не критична
  return useMemo(() => findRouteObjectByPath(pathname, APP_ROUTES), [pathname])
}

/** Утилита: нормализует список прав к массиву. */
function normalizeRequired(required?: Permission[] | Permission): Permission[] | undefined {
  if (!required) return undefined
  return Array.isArray(required) ? required : [required]
}

/**
 * Чистая проверка «есть ли ХОТЯ БЫ одно требуемое право».
 * @param userPerms - права пользователя (Set<string>)
 * @param required - одно или несколько прав (OR-логика)
 */
function hasAnyPermission(userPerms: Set<string>, required?: Permission[] | Permission): boolean {
  const list = normalizeRequired(required)
  if (!list || list.length === 0) return true
  return list.some((p) => userPerms.has(p))
}

/**
 * Чистая проверка «можно ли по правам».
 * Суперпользователь получает доступ без оглядки на required.
 */
function canByPermissions(
  user: UserDetailResponse | null | undefined,
  userPerms: Set<string>,
  required?: Permission[] | Permission,
): boolean {
  if (user?.isSuperuser) return true
  return hasAnyPermission(userPerms, required)
}

/**
 * Достаёт права на действие:
 * 1) currentRoute.meta.actionPermissions[action]
 * 2) fallback: requiredPermissions целевого роута (если передан targetPath)
 * 3) undefined — если правило явно не найдено
 */
function resolveActionPermissions(
  currentRoute: AppRoute | undefined,
  action: PageAction,
  targetPath?: string,
): Permission[] | undefined {
  const fromMeta = currentRoute?.meta?.actionPermissions?.[action]
  if (fromMeta) return fromMeta

  if (targetPath) {
    const target = findRouteObjectByPath(targetPath, APP_ROUTES)
    if (target?.requiredPermissions?.length) return target.requiredPermissions
  }

  return undefined
}

/**
 * Проверка по явному списку прав (OR).
 * Если required не задан — трактуется как «разрешено».
 */
export function useCanByRequired(required?: Permission[] | Permission): boolean {
  const { currentUser } = useAuth()
  const userPerms = useUserPermissionsSet()
  // Лишняя мемоизация не нужна — операции O(n) по маленькому списку.
  return canByPermissions(currentUser, userPerms, required)
}

/**
 * Проверка по action на текущей странице.
 * По умолчанию deny-by-default (allowIfMissing=false), но можно переопределить.
 * opts.override — принудительно задать список прав, минуя meta/targetPath.
 */
export function useCanAction(
  action: PageAction,
  opts?: { targetPath?: string; override?: Permission[] | Permission; allowIfMissing?: boolean },
): boolean {
  const { currentUser } = useAuth()
  const userPerms = useUserPermissionsSet()
  const currentRoute = useCurrentRoute()

  const allowIfMissing = opts?.allowIfMissing ?? false
  const required =
    opts?.override ?? resolveActionPermissions(currentRoute, action, opts?.targetPath)

  if (required === undefined) return allowIfMissing
  return canByPermissions(currentUser, userPerms, required)
}

/**
 * Универсальная проверка для компонента CanAccess:
 * 1) Если передан requiredPermissions — проверяем их (OR).
 * 2) Иначе если передан action — ищем правило в meta, либо в targetPath; если правило не найдено — deny-by-default.
 * 3) Иначе — false.
 */
export function useCan(params: {
  requiredPermissions?: Permission[] | Permission
  action?: PageAction
  targetPathForAction?: string
}): boolean {
  const { requiredPermissions, action, targetPathForAction } = params
  const { currentUser } = useAuth()
  const userPerms = useUserPermissionsSet()
  const currentRoute = useCurrentRoute()

  // Весь расчёт синхронный и дешёвый — без useMemo.
  if (requiredPermissions !== undefined) {
    return canByPermissions(currentUser, userPerms, requiredPermissions)
  }

  if (action) {
    const req = resolveActionPermissions(currentRoute, action, targetPathForAction)
    if (req === undefined) return false // deny-by-default
    return canByPermissions(currentUser, userPerms, req)
  }

  return false
}
