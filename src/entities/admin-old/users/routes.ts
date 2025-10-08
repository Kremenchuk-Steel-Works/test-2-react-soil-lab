import { lazy } from 'react'
import { CirclePlus, Info, RefreshCcw, Users } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'

const AdminUsersLayout = lazy(() => import('@/pages/admin-panel/users/Layout'))
const AdminUsersList = lazy(() => import('@/pages/admin-panel/users/list/List'))
const AdminUsersAdd = lazy(() => import('@/pages/admin-panel/users/Add'))
const AdminUsersDetails = lazy(() => import('@/pages/admin-panel/users/Details'))
const AdminUsersUpdate = lazy(() => import('@/pages/admin-panel/users/Update'))

export const usersRoutes: AppRoute = {
  key: 'adminUsers',
  path: 'users',
  label: 'Користувачі',
  icon: Users,
  Component: AdminUsersLayout,
  meta: {
    buttons: [PageAction.create],
    actionPermissions: {
      [PageAction.create]: [PERMISSIONS.ADMIN],
    },
  },
  children: [
    {
      index: true,
      Component: AdminUsersList,
    },
    {
      key: 'adminUsersAdd',
      path: segment(PageAction.create),
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminUsersAdd,
    },
    {
      key: 'adminUsersDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminUsersDetails,
      meta: {
        buttons: [PageAction.update],
        actionPermissions: {
          [PageAction.update]: [PERMISSIONS.ADMIN],
        },
      },
    },
    {
      key: 'adminUsersUpdate',
      path: `:id/${segment(PageAction.update)}`,
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminUsersUpdate,
    },
  ],
}
