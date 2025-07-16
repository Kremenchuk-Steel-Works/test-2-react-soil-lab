import { lazy } from 'react'
import { CirclePlus, Database, Info, Lock, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const AdminPermissionsLayout = lazy(() => import('@/pages/admin-panel/permissions/Layout'))
const AdminPermissionsList = lazy(() => import('@/pages/admin-panel/permissions/list/List'))
const AdminPermissionsAdd = lazy(() => import('@/pages/admin-panel/permissions/Add'))
const AdminPermissionsDetails = lazy(() => import('@/pages/admin-panel/permissions/Details'))
const AdminPermissionsUpdate = lazy(() => import('@/pages/admin-panel/permissions/Update'))

export const permissionsRoutes: AppRoute = {
  key: 'adminPermissions',
  path: 'permissions',
  label: 'Права доступу',
  icon: Lock,
  Component: AdminPermissionsLayout,
  meta: {
    showAddButton: true,
  },
  children: [
    {
      key: 'adminPermissionsList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminPermissionsList,
    },
    {
      key: 'adminPermissionsAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminPermissionsAdd,
    },
    {
      key: 'adminPermissionsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminPermissionsDetails,
      meta: {
        showEditButton: true,
      },
    },
    {
      key: 'adminPermissionsUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminPermissionsUpdate,
    },
  ],
}
