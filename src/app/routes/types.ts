import type { LucideIcon } from 'lucide-react'

export type Permission =
  | 'admin'
  | 'quality_dash_view'
  | 'calculator_view'
  | 'library_view'
  | 'library_edit'

export type PageButtonType = 'add' | 'update'

export interface RouteMeta {
  buttons?: PageButtonType[]
}

export interface AppRoute {
  key: string
  path: string
  label: string
  icon: LucideIcon
  Component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>
  requiredPermissions?: Permission[]
  inSidebar?: boolean
  children?: AppRoute[]
  meta?: RouteMeta
}
