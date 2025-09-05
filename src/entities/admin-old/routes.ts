import { lazy } from 'react'
import { Shield, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import { cityRoutes } from '@/entities/admin-old/city/routes'
import { countryRoutes } from '@/entities/admin-old/country/routes'
import { departmentsRoutes } from '@/entities/admin-old/departments/routes'
import { organizationsRoutes } from '@/entities/admin-old/organizations/routes'
import { peopleRoutes } from '@/entities/admin-old/people/routes'
import { permissionsRoutes } from '@/entities/admin-old/permissions/routes'
import { positionsRoutes } from '@/entities/admin-old/positions/routes'
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
  requiredPermissions: ['admin'],
  children: [
    {
      key: 'adminPanel',
      path: '',
      label: '',
      icon: Users,
      Component: AdminPanelMain,
      inSidebar: false,
    },
    peopleRoutes,
    usersRoutes,
    organizationsRoutes,
    positionsRoutes,
    departmentsRoutes,
    rolesRoutes,
    permissionsRoutes,
    countryRoutes,
    cityRoutes,
  ],
}
