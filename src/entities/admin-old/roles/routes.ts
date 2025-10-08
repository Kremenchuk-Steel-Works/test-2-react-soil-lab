import { lazy } from 'react'
import { CirclePlus, Info, RefreshCcw, ShieldCheck } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'

const AdminRolesLayout = lazy(() => import('@/pages/admin-panel/roles/Layout'))
const AdminRolesList = lazy(() => import('@/pages/admin-panel/roles/list/List'))
const AdminRolesAdd = lazy(() => import('@/pages/admin-panel/roles/Add'))
const AdminRolesDetails = lazy(() => import('@/pages/admin-panel/roles/Details'))
const AdminRolesUpdate = lazy(() => import('@/pages/admin-panel/roles/Update'))

export const rolesRoutes: AppRoute = {
  key: 'adminRoles',
  path: 'roles',
  label: 'Ролі',
  icon: ShieldCheck,
  Component: AdminRolesLayout,
  meta: {
    buttons: [PageAction.create],
    actionPermissions: {
      [PageAction.create]: [PERMISSIONS.ADMIN],
    },
  },
  children: [
    {
      index: true,
      Component: AdminRolesList,
    },
    {
      key: 'adminRolesAdd',
      path: segment(PageAction.create),
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
      meta: {
        buttons: [PageAction.update],
        actionPermissions: {
          [PageAction.update]: [PERMISSIONS.ADMIN],
        },
      },
    },
    {
      key: 'adminRolesUpdate',
      path: `:id/${segment(PageAction.update)}`,
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminRolesUpdate,
    },
  ],
}
