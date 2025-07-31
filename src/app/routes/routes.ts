import { lazy } from 'react'
import { Calculator, Database, House } from 'lucide-react'
import { PATHS } from '@/app/routes/paths'
import type { AppRoute } from '@/app/routes/types'
import { adminRoutes } from '@/entities/admin/routes'
import { moldingShopRoutes } from '@/entities/molding-shop/routes'

const MainPage = lazy(() => import('@/pages/MainPage'))
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
  adminRoutes,
  // moldPassportMainRoutes,
  moldingShopRoutes,
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
  // libraryRoutes,
]
