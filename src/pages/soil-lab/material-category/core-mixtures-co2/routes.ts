import { lazy } from 'react'
import { ClipboardList } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { coreMixturesCO2SamplesRoutes } from '@/pages/soil-lab/material-category/core-mixtures-co2/samples/routes'
import { coreMixturesCO2TestsRoutes } from '@/pages/soil-lab/material-category/core-mixtures-co2/tests/routes'

const CoreMixturesCO2MainPage = lazy(() => import('./ui/Main'))
const MaterialCategoryLayoutPage = lazy(
  () => import('@/pages/soil-lab/material-category/ui/Layout'),
)

export const materialCategoryCoreMixturesCO2Routes: AppRoute = {
  key: 'materialCategoryCoreMixturesCO2',
  path: 'core-mixtures-co2',
  label: 'Стрижневі суміші (CO2-процес)',
  icon: ClipboardList,
  Component: MaterialCategoryLayoutPage,
  requiredPermissions: [PERMISSIONS.SAMPLES_READ],
  children: [
    {
      index: true,
      Component: CoreMixturesCO2MainPage,
    },
    coreMixturesCO2SamplesRoutes,
    coreMixturesCO2TestsRoutes,
  ],
}
