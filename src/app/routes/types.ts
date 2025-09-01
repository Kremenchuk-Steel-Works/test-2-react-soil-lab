import type { ComponentType, LazyExoticComponent } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Permission } from '@/app/routes/permissions'

export type PageButtonType = 'add' | 'update' | 'delete'

export interface RouteMeta {
  buttons?: PageButtonType[]
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
