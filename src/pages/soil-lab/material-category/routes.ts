import { lazy } from 'react'
import { ClipboardList, Users } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import soilLabMain from '@/pages/soil-lab/Main'
import { samplesRoutes } from '@/pages/soil-lab/samples/routes'
import { testsRoutes } from '@/pages/soil-lab/tests/routes'

const SamplesLayout = lazy(() => import('@/pages/soil-lab/samples/ui/Layout'))

export const samplesMaterialCategoryRoutes: AppRoute = {
  key: 'soilLabMoldingMixtures',
  path: 'molding-mixtures',
  label: 'Формувальні суміші',
  icon: ClipboardList,
  Component: SamplesLayout,
  requiredPermissions: [PERMISSIONS.SAMPLES_READ],
  meta: {
    buttons: ['add'],
  },
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
