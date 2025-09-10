import { lazy } from 'react'
import { CirclePlus, Database, Info, TestTubeDiagonal } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const MoistureLayout = lazy(() => import('@/pages/soil-lab/experiments/moisture/ui/Layout'))
const MoistureList = lazy(() => import('@/pages/soil-lab/experiments/moisture/ui/list/List'))
const MoistureAdd = lazy(() => import('@/pages/soil-lab/experiments/moisture/ui/Add'))
const MoistureDetails = lazy(() => import('@/pages/soil-lab/experiments/moisture/ui/Details'))

export const moistureRoutes: AppRoute = {
  key: 'Moisture',
  path: 'moisture',
  label: 'Вимірювання вологості',
  icon: TestTubeDiagonal,
  Component: MoistureLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MoistureList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MoistureList,
    },
    {
      key: 'MoistureAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MoistureAdd,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_CREATE],
    },
    {
      key: 'MoistureDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MoistureLayout,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_READ],
      children: [
        {
          key: 'MoistureIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: MoistureDetails,
        },
      ],
    },
  ],
}
