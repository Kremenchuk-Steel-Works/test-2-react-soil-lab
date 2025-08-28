import type { LucideIcon } from 'lucide-react'
import type { Permission } from '@/app/routes/permissions'

export type PageButtonType = 'add' | 'update' | 'delete'

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
