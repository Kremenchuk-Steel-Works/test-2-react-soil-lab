import { lazy } from 'react'
import { CirclePlus, Info, RefreshCcw, Users } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'
import { createRouteKeyNs } from '@/app/routes/utils/route-key'

const AdminUsersLayoutPage = lazy(() => import('@/pages/admin-panel/users/Layout'))
const AdminUsersListPage = lazy(() => import('@/pages/admin-panel/users/list/List'))
const AdminUsersNewPage = lazy(() => import('@/pages/admin-panel/users/New'))
const AdminUsersDetailsPage = lazy(() => import('@/pages/admin-panel/users/Details'))
const AdminUsersEditPage = lazy(() => import('@/pages/admin-panel/users/Edit'))

const routeKeys = createRouteKeyNs('admin', 'users')

export const usersRoutes: AppRoute = {
  key: routeKeys(),
  path: 'users',
  label: 'Користувачі',
  icon: Users,
  Component: AdminUsersLayoutPage,
  meta: {
    buttons: [PageAction.create],
    actionPermissions: {
      [PageAction.create]: [PERMISSIONS.ADMIN],
    },
  },
  children: [
    {
      index: true,
      Component: AdminUsersListPage,
    },
    {
      key: routeKeys(segment(PageAction.create)),
      path: segment(PageAction.create),
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminUsersNewPage,
    },
    {
      key: routeKeys('detail'),
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminUsersDetailsPage,
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
      Component: AdminUsersEditPage,
    },
  ],
}
