import { lazy } from 'react'
import { ClipboardList } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { moldingMixturesSamplesRoutes } from '@/pages/soil-lab/material-category/molding-mixtures/samples/routes'
import { moldingMixturesTestsRoutes } from '@/pages/soil-lab/material-category/molding-mixtures/tests/routes'

const MoldingMixturesMainPage = lazy(() => import('./ui/Main'))
const MaterialCategoryLayoutPage = lazy(
  () => import('@/pages/soil-lab/material-category/ui/Layout'),
)

export const materialCategoryMoldingMixturesRoutes: AppRoute = {
  key: 'materialCategoryMoldingMixtures',
  path: 'molding-mixtures',
  label: 'Формувальні суміші',
  icon: ClipboardList,
  Component: MaterialCategoryLayoutPage,
  requiredPermissions: [PERMISSIONS.SAMPLES_READ],
  children: [
    {
      index: true,
      Component: MoldingMixturesMainPage,
    },
    moldingMixturesSamplesRoutes,
    moldingMixturesTestsRoutes,
  ],
}
