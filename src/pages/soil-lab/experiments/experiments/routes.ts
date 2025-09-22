import { lazy } from 'react'
import { CirclePlus, Database, FlaskConical, Info } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const ExperimentsLayout = lazy(() => import('@/pages/soil-lab/experiments/experiments/ui/Layout'))
const ExperimentsList = lazy(() => import('@/pages/soil-lab/experiments/experiments/ui/list/List'))
const ExperimentsAdd = lazy(() => import('@/pages/soil-lab/experiments/experiments/ui/Add'))
const ExperimentsDetails = lazy(() => import('@/pages/soil-lab/experiments/experiments/ui/Details'))

export const experimentsRoutes: AppRoute = {
  key: 'Experiments',
  path: 'experiments',
  label: 'Випробування формувальної суміші',
  icon: FlaskConical,
  Component: ExperimentsLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'ExperimentsList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: ExperimentsList,
    },
    {
      key: 'ExperimentsAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: ExperimentsAdd,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_CREATE],
    },
    {
      key: 'ExperimentsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: ExperimentsLayout,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_READ],
      children: [
        {
          key: 'ExperimentsIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: ExperimentsDetails,
        },
      ],
    },
  ],
}
