import { lazy } from 'react'
import { FlaskConical, Users } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { samplesRoutes } from '@/pages/soil-lab/samples/routes'
import { testsRoutes } from '@/pages/soil-lab/tests/routes'

const soilLabLayout = lazy(() => import('@/pages/soil-lab/Layout'))
const soilLabMain = lazy(() => import('@/pages/soil-lab/Main'))

export const soilLabRoutes: AppRoute = {
  key: 'soilLab',
  path: '/soil-lab',
  label: 'Лабораторія сумішей',
  icon: FlaskConical,
  Component: soilLabLayout,
  requiredPermissions: [PERMISSIONS.SAMPLES_READ, PERMISSIONS.TESTS_READ],
  children: [
    {
      key: '',
      path: '',
      label: '',
      icon: Users,
      Component: soilLabMain,
      inSidebar: false,
    },
    samplesRoutes,
    testsRoutes,
  ],
}
