import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { PageButtonType } from '@/app/routes/types'
import { findRouteObjectByPath } from '@/app/routes/utils/utils'

/**
 * Возвращает список действий для заголовка страницы ТОЛЬКО из meta.actionPermissions.
 * Доступ здесь НЕ проверяем (это делает CanAccess в самих кнопках).
 * Порядок — из meta.buttons (если задан), иначе по ключам actionPermissions.
 */
export function usePageHeaderActions(): PageButtonType[] {
  const { pathname } = useLocation()
  const currentRoute = useMemo(() => findRouteObjectByPath(pathname), [pathname])

  return useMemo(() => {
    const map = currentRoute?.meta?.actionPermissions as
      | Partial<Record<PageButtonType, unknown>>
      | undefined
    if (!map) return []

    const declared = Object.keys(map) as PageButtonType[]

    const orderFromMeta = currentRoute?.meta?.buttons
    if (orderFromMeta?.length) {
      // оставляем только те, что реально описаны в actionPermissions
      return orderFromMeta.filter((a) => declared.includes(a))
    }

    return declared
  }, [currentRoute])
}
