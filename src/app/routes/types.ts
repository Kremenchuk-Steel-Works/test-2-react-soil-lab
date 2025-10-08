import type { ComponentType, LazyExoticComponent } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Permission } from '@/app/routes/permissions'
import type { ValueOf } from '@/types/utility'

export const PageAction = {
  create: 'create',
  update: 'update',
  delete: 'delete',
} as const
export type PageAction = keyof typeof PageAction

export const PageSegment = {
  create: 'new',
  update: 'edit',
  delete: 'delete',
} as const satisfies Record<PageAction, string>
export type PageSegment = ValueOf<typeof PageSegment>
export const segment = (action: PageAction): PageSegment => PageSegment[action]

export interface RouteMeta {
  buttons?: PageAction[]
  actionPermissions?: Partial<Record<PageAction, Permission[]>>
}

/**
 * Универсальный тип для компонента роута (может быть ленивым или обычным).
 * По умолчанию считаем, что пропсов нет.
 */
type RouteComponent<P = Record<string, never>> =
  | ComponentType<P>
  | LazyExoticComponent<ComponentType<P>>

/**
 * Вариант стандартного роута (обычный пункт меню / страница).
 * Требует key, path, label, icon.
 */
export interface NonIndexRoute<P = Record<string, never>> {
  index?: false
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

/**
 * Вариант индексного роута (RouteObject.index = true).
 * Не требует key/path/label/icon; допускаем path: '' или вовсе отсутствие.
 * Дочерних быть не должно.
 */
export interface IndexRoute<P = Record<string, never>> {
  index: true
  Component: RouteComponent<P>
  requiredPermissions?: Permission[]
  /** Индексные страницы не попадают в сайдбар. */
  inSidebar?: false
  meta?: RouteMeta
  /** Для обратной совместимости допускаем пустой path, но он не используется. */
  path?: ''
  children?: never
}

/** Универсальный тип приложения: либо обычный роут, либо индексный. */
export type AppRoute<P = Record<string, never>> = NonIndexRoute<P> | IndexRoute<P>

// export interface AppRoute<P = Record<string, never>> {
//   key: string
//   path: string
//   label: string
//   icon: LucideIcon
//   Component: RouteComponent<P>
//   requiredPermissions?: Permission[]
//   inSidebar?: boolean
//   children?: AppRoute[]
//   meta?: RouteMeta
// }
