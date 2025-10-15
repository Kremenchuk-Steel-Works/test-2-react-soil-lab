import { lazy } from 'react'
import { House } from 'lucide-react'
import { PATHS } from '@/app/routes/paths'
import type { AppRoute } from '@/app/routes/types'
import { createRouteKeyNs } from '@/app/routes/utils/route-key'
import { adminRoutes } from '@/entities/admin-old/routes'
import { soilLabRoutes } from '@/pages/soil-lab/routes'

const MainPage = lazy(() => import('@/pages/MainPage'))

const routeKeys = createRouteKeyNs('main')

export const APP_ROUTES: AppRoute[] = [
  {
    key: routeKeys(),
    path: PATHS.MAIN,
    label: 'Головна сторінка',
    icon: House,
    Component: MainPage,
    inSidebar: false,
  },
  adminRoutes,
  soilLabRoutes,
]
