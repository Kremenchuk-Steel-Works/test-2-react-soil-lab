import { lazy } from 'react'
import { FlaskConical } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { samplesMaterialCategoryRoutes } from '@/pages/soil-lab/material-category/routes'

const SoilLabLayoutPage = lazy(() => import('@/pages/soil-lab/ui/Layout'))
const SoilLabMainPage = lazy(() => import('@/pages/soil-lab/ui/Main'))

export const soilLabRoutes: AppRoute = {
  key: 'soilLab',
  path: '/soil-lab',
  label: 'Лабораторія сумішей',
  icon: FlaskConical,
  Component: SoilLabLayoutPage,
  requiredPermissions: [PERMISSIONS.SAMPLES_READ, PERMISSIONS.TESTS_READ],
  children: [
    {
      index: true,
      Component: SoilLabMainPage,
    },
    ...samplesMaterialCategoryRoutes,
  ],
}
