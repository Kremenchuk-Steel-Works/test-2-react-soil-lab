import { lazy } from 'react'
import { CirclePlus, Info, RefreshCcw, ShieldCheck } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'
import { createRouteKeyNs } from '@/app/routes/utils/route-key'

const AdminRolesLayoutPage = lazy(() => import('@/pages/admin-panel/roles/Layout'))
const AdminRolesListPage = lazy(() => import('@/pages/admin-panel/roles/list/List'))
const AdminRolesNewPage = lazy(() => import('@/pages/admin-panel/roles/New'))
const AdminRolesDetailsPage = lazy(() => import('@/pages/admin-panel/roles/Details'))
const AdminRolesEditPage = lazy(() => import('@/pages/admin-panel/roles/Edit'))

const routeKeys = createRouteKeyNs('admin', 'roles')

export const rolesRoutes: AppRoute = {
  key: routeKeys(),
  path: 'roles',
  label: 'Ролі',
  icon: ShieldCheck,
  Component: AdminRolesLayoutPage,
  meta: {
    buttons: [PageAction.create],
    actionPermissions: {
      [PageAction.create]: [PERMISSIONS.ADMIN],
    },
  },
  children: [
    {
      index: true,
      Component: AdminRolesListPage,
    },
    {
      key: routeKeys(segment(PageAction.create)),
      path: segment(PageAction.create),
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminRolesNewPage,
    },
    {
      key: routeKeys('detail'),
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminRolesDetailsPage,
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
      Component: AdminRolesEditPage,
    },
  ],
}
