import { lazy } from 'react'
import { CirclePlus, Info, Lock, RefreshCcw } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'
import { createRouteKeyNs } from '@/app/routes/utils/route-key'

const AdminPermissionsLayoutPage = lazy(() => import('@/pages/admin-panel/permissions/Layout'))
const AdminPermissionsListPage = lazy(() => import('@/pages/admin-panel/permissions/list/List'))
const AdminPermissionsNewPage = lazy(() => import('@/pages/admin-panel/permissions/New'))
const AdminPermissionsDetailsPage = lazy(() => import('@/pages/admin-panel/permissions/Details'))
const AdminPermissionsEditPage = lazy(() => import('@/pages/admin-panel/permissions/Edit'))

const routeKeys = createRouteKeyNs('admin', 'permissions')

export const permissionsRoutes: AppRoute = {
  key: routeKeys(),
  path: 'permissions',
  label: 'Права доступу',
  icon: Lock,
  Component: AdminPermissionsLayoutPage,
  meta: {
    buttons: [PageAction.create],
    actionPermissions: {
      [PageAction.create]: [PERMISSIONS.ADMIN],
    },
  },
  children: [
    {
      index: true,
      Component: AdminPermissionsListPage,
    },
    {
      key: routeKeys(segment(PageAction.create)),
      path: segment(PageAction.create),
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminPermissionsNewPage,
    },
    {
      key: routeKeys('detail'),
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminPermissionsDetailsPage,
      meta: {
        buttons: [PageAction.update],
        actionPermissions: {
          [PageAction.update]: [PERMISSIONS.ADMIN],
        },
      },
    },
    {
      key: routeKeys(segment(PageAction.update)),
      path: `:id/${segment(PageAction.update)}`,
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminPermissionsEditPage,
    },
  ],
}
