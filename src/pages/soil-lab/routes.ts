import { lazy } from 'react'
import { FlaskConical } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { createRouteKeyNs } from '@/app/routes/utils/route-key'
import { coreMixturesCO2SamplesRoutes } from '@/pages/soil-lab/material-category/core-mixtures-co2/samples/routes'
import { moldingMixturesSamplesRoutes } from '@/pages/soil-lab/material-category/molding-mixtures/samples/routes'

const SoilLabLayoutPage = lazy(() => import('@/pages/soil-lab/ui/Layout'))
const SoilLabMainPage = lazy(() => import('@/pages/soil-lab/ui/Index'))

const routeKeys = createRouteKeyNs('soilLab')

export const soilLabRoutes: AppRoute = {
  key: routeKeys(),
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
    coreMixturesCO2SamplesRoutes,
    moldingMixturesSamplesRoutes,
  ],
}
