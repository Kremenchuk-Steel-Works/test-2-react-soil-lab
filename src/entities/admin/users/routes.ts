import { lazy } from 'react'
import { CirclePlus, Database, Info, RefreshCcw, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

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
    showAddButton: true,
  },
  children: [
    {
      key: 'adminUsersList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminUsersList,
    },
    {
      key: 'adminUsersAdd',
      path: 'add',
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
        showEditButton: true,
      },
    },
    {
      key: 'adminUsersUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminUsersUpdate,
    },
  ],
}
