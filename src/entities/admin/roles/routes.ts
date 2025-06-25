import { lazy } from 'react'
import { CirclePlus, Database, Info, RefreshCcw, ShieldCheck } from 'lucide-react'
import type { AppRoute } from '@/app/routes/routes'
import AdminRolesLayout from '@/pages/admin-panel/roles/Layout'

const AdminRolesList = lazy(() => import('../../../pages/admin-panel/roles/list/List'))
const AdminRolesAdd = lazy(() => import('../../../pages/admin-panel/roles/Add'))
const AdminRolesDetails = lazy(() => import('../../../pages/admin-panel/roles/Details'))
const AdminRolesUpdate = lazy(() => import('../../../pages/admin-panel/roles/Update'))

export const rolesRoutes: AppRoute = {
  key: 'adminRoles',
  path: 'roles',
  label: 'Ролі',
  icon: ShieldCheck,
  Component: AdminRolesLayout,
  children: [
    {
      key: 'adminRolesList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminRolesList,
    },
    {
      key: 'adminRolesAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminRolesAdd,
    },
    {
      key: 'adminRolesDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminRolesDetails,
    },
    {
      key: 'adminRolesUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminRolesUpdate,
    },
  ],
}
