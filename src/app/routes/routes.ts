import { lazy } from 'react'
import { House } from 'lucide-react'
import { PATHS } from '@/app/routes/paths'
import type { AppRoute } from '@/app/routes/types'
import { adminRoutes } from '@/entities/admin-old/routes'
import { soilLabRoutes } from '@/pages/soil-lab/routes'

const MainPage = lazy(() => import('@/pages/MainPage'))

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
  soilLabRoutes,
]
