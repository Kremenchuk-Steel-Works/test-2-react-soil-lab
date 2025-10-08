import { lazy } from 'react'
import { CirclePlus, Info, Lock, RefreshCcw } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'

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
    buttons: [PageAction.create],
    actionPermissions: {
      [PageAction.create]: [PERMISSIONS.ADMIN],
    },
  },
  children: [
    {
      index: true,
      Component: AdminPermissionsList,
    },
    {
      key: 'adminPermissionsAdd',
      path: segment(PageAction.create),
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
        buttons: [PageAction.update],
        actionPermissions: {
          [PageAction.update]: [PERMISSIONS.ADMIN],
        },
      },
    },
    {
      key: 'adminPermissionsUpdate',
      path: `:id/${segment(PageAction.update)}`,
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminPermissionsUpdate,
    },
  ],
}
