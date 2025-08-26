import { lazy } from 'react'
import { Calculator, Database, FileText, House } from 'lucide-react'
import { PATHS } from '@/app/routes/paths'
import type { AppRoute } from '@/app/routes/types'
import { adminRoutes } from '@/entities/admin/routes'
import { moldingShopRoutes } from '@/entities/molding-shop/routes'
import { soilLabRoutes } from '@/pages/soil-lab/routes'

const MainPage = lazy(() => import('@/pages/MainPage'))
const StreamlitDashboard = lazy(() => import('@/pages/StreamlitDashboard'))
const StreamlitCalculator = lazy(() => import('@/pages/StreamlitCalculator'))
const DocumentInfoPage = lazy(() => import('@/pages/DocumentInfo'))

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
  {
    key: 'documentInfo',
    path: '/document-info',
    label:
      'П 001-2025 «Процедура з проведення магнітопорошкового контролю корпусу букси кресленик 0014.11.001»',
    icon: FileText,
    Component: DocumentInfoPage,
    requiredPermissions: ['document_pdf_view'],
  },
  // libraryRoutes,
]
