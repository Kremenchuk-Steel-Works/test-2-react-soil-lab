import type { ComponentType, LazyExoticComponent } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Permission } from '@/app/routes/permissions'

export const PageButtonType = {
  add: 'add',
  update: 'update',
  delete: 'delete',
} as const
export type PageButtonType = keyof typeof PageButtonType

export interface RouteMeta {
  buttons?: PageButtonType[]
  actionPermissions?: Partial<Record<PageButtonType, Permission[]>>
}

/**
 * Универсальный тип для компонента роутa (может быть ленивым или обычным).
 * По умолчанию считаем, что пропсов нет.
 */
type RouteComponent<P = Record<string, never>> =
  | ComponentType<P>
  | LazyExoticComponent<ComponentType<P>>

export interface AppRoute<P = Record<string, never>> {
  key: string
  path: string
  label: string
  icon: LucideIcon
  Component: RouteComponent<P>
  requiredPermissions?: Permission[]
  inSidebar?: boolean
  children?: AppRoute[]
  meta?: RouteMeta
}
