import { lazy } from 'react'
import { Shield } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { permissionsRoutes } from '@/entities/admin-old/permissions/routes'
import { rolesRoutes } from '@/entities/admin-old/roles/routes'
import { usersRoutes } from '@/entities/admin-old/users/routes'

const AdminPanelLayout = lazy(() => import('@/pages/admin-panel/Layout'))
const AdminPanelMain = lazy(() => import('@/pages/admin-panel/Main'))

export const adminRoutes: AppRoute = {
  key: 'admin',
  path: '/admin',
  label: 'Адмін панель',
  icon: Shield,
  Component: AdminPanelLayout,
  requiredPermissions: [PERMISSIONS.ADMIN],
  children: [
    {
      index: true,
      Component: AdminPanelMain,
    },
    usersRoutes,
    rolesRoutes,
    permissionsRoutes,
  ],
}
