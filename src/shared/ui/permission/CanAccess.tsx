import type { ReactNode } from 'react'
import type { Permission } from '@/app/routes/permissions'
import type { PageAction } from '@/app/routes/types'
import { useCan } from '@/shared/hooks/usePermissions'

type CanAccessProps = {
  requiredPermissions?: Permission[] | Permission
  action?: PageAction
  /** Для действий, которые ведут на страницу (add/update), можно подсказать путь fallBack-роута */
  targetPathForAction?: string
  fallback?: ReactNode
  children: ReactNode
}

export function CanAccess({
  requiredPermissions,
  action,
  targetPathForAction,
  fallback = null,
  children,
}: CanAccessProps) {
  const allowed = useCan({ requiredPermissions, action, targetPathForAction })
  return allowed ? <>{children}</> : <>{fallback}</>
}
