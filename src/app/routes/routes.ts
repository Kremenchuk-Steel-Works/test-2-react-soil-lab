import { lazy } from 'react'
import { Calculator, Database, House } from 'lucide-react'
import { PATHS } from '@/app/routes/paths'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { adminRoutes } from '@/entities/admin/routes'
import { moldingShopRoutes } from '@/entities/molding-shop/routes'
import { ndtDocumentsRoutes } from '@/pages/ndt-documents/routes'
import { soilLabRoutes } from '@/pages/soil-lab/routes'

const MainPage = lazy(() => import('@/pages/MainPage'))
const StreamlitDashboard = lazy(() => import('@/pages/StreamlitDashboard'))
const StreamlitCalculator = lazy(() => import('@/pages/StreamlitCalculator'))
const MaterialCalculator = lazy(() => import('@/pages/MaterialCalculator'))

export const APP_ROUTES: AppRoute[] = [
  {
    key: 'main',
    path: PATHS.MAIN,
    label: 'Головна сторінка',
    icon: House,
    Component: MainPage,
    inSidebar: false,
  },
  adminRoutes,
  // moldPassportMainRoutes,
  moldingShopRoutes,
  soilLabRoutes,
  ndtDocumentsRoutes,
  {
    key: 'streamlitDashboard',
    path: '/streamlit-dashboard',
    label: 'Quality Dash',
    icon: Database,
    Component: StreamlitDashboard,
    requiredPermissions: [PERMISSIONS.QUALITY_DASH_VIEW],
  },
  {
    key: 'streamlitCalculator',
    path: '/streamlit-calculator',
    label: 'Калькулятор енергоспоживання',
    icon: Calculator,
    Component: StreamlitCalculator,
    requiredPermissions: [PERMISSIONS.CALCULATOR_VIEW],
  },
  {
    key: 'materialCalculator',
    path: '/material-calculator',
    label: 'Калькулятор розрахунку матеріалів',
    icon: Calculator,
    Component: MaterialCalculator,
    requiredPermissions: [PERMISSIONS.MATERIAL_CALCULATOR_VIEW],
  },
]
