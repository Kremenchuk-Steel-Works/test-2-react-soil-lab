import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { Permission } from '@/app/routes/permissions'
import type { PageAction } from '@/app/routes/types'
import { findRouteObjectByPath } from '@/app/routes/utils/utils'

/**
 * Возвращает порядок действий для хедера ТОЛЬКО из meta.buttons,
 * причём оставляет лишь те, для кого есть правило в meta.actionPermissions.
 * Если meta.buttons отсутствует или пуст — ничего не показываем ( [] ).
 * Доступ здесь НЕ проверяем — это делает CanAccess в самих кнопках.
 */
export function usePageHeaderActions(): PageAction[] {
  const { pathname } = useLocation()
  const currentRoute = useMemo(() => findRouteObjectByPath(pathname), [pathname])

  return useMemo(() => {
    const meta = currentRoute?.meta
    const buttons = meta?.buttons
    if (!buttons || buttons.length === 0) return []

    const actionPerms = meta?.actionPermissions as
      | Partial<Record<PageAction, Permission[] | Permission>>
      | undefined
    if (!actionPerms) return []

    const declared = new Set(Object.keys(actionPerms) as PageAction[])

    // Показываем только те кнопки, которые явно перечислены в buttons и имеют правило в actionPermissions
    return buttons.filter((btn) => declared.has(btn))
  }, [currentRoute])
}
