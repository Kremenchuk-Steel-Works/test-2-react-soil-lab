import { lazy } from 'react'
import { Calculator, Database, House, Shield, Users } from 'lucide-react'
import { PATHS } from '@/app/routes/paths'
import type { AppRoute } from '@/app/routes/types'
import { cityRoutes } from '@/entities/admin/city/routes'
import { countryRoutes } from '@/entities/admin/country/routes'
import { departmentsRoutes } from '@/entities/admin/departments/routes'
import { organizationsRoutes } from '@/entities/admin/organizations/routes'
import { peopleRoutes } from '@/entities/admin/people/routes'
import { permissionsRoutes } from '@/entities/admin/permissions/routes'
import { positionsRoutes } from '@/entities/admin/positions/routes'
import { rolesRoutes } from '@/entities/admin/roles/routes'
import { usersRoutes } from '@/entities/admin/users/routes'
import { libraryRoutes } from '@/entities/library/routes'
import { moldPassportMainRoutes } from '@/entities/mold-passport/routes'

const MainPage = lazy(() => import('@/pages/MainPage'))
const AdminPanelLayout = lazy(() => import('@/pages/admin-panel/Layout'))
const AdminPanelMain = lazy(() => import('@/pages/admin-panel/Main'))
const StreamlitDashboard = lazy(() => import('@/pages/StreamlitDashboard'))
const StreamlitCalculator = lazy(() => import('@/pages/StreamlitCalculator'))

export const APP_ROUTES: AppRoute[] = [
  {
    key: 'main',
    path: PATHS.MAIN,
    label: 'Головна сторінка',
    icon: House,
    Component: MainPage,
    inSidebar: false,
  },
  {
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
  },
  moldPassportMainRoutes,
  {
    key: 'streamlitDashboard',
    path: '/streamlit-dashboard',
    label: 'Quality Dash',
    icon: Database,
    Component: StreamlitDashboard,
    requiredPermissions: ['quality_dash_view'],
  },
  {
    key: 'streamlitCalculator',
    path: '/streamlit-calculator',
    label: 'Калькулятор енергоспоживання',
    icon: Calculator,
    Component: StreamlitCalculator,
    requiredPermissions: ['calculator_view'],
  },
  libraryRoutes,
]
