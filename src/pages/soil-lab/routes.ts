import { lazy } from 'react'
import { FlaskConical, Users } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { measurementsRoutes } from '@/pages/soil-lab/measurements/routes'

const soilLabLayout = lazy(() => import('@/pages/soil-lab/Layout'))
const soilLabMain = lazy(() => import('@/pages/soil-lab/Main'))

export const soilLabRoutes: AppRoute = {
  key: 'soilLab',
  path: '/soil-lab',
  label: 'Лабораторія сумішей',
  icon: FlaskConical,
  Component: soilLabLayout,
  requiredPermissions: [PERMISSIONS.MEASUREMENTS_READ],
  children: [
    {
      key: '',
      path: '',
      label: '',
      icon: Users,
      Component: soilLabMain,
      inSidebar: false,
    },
    measurementsRoutes,
    // experimentsRoutes,
  ],
}
