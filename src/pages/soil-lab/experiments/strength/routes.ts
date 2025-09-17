import { lazy } from 'react'
import { CirclePlus, Database, FlaskConical, Info } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const StrengthLayout = lazy(() => import('@/pages/soil-lab/experiments/strength/ui/Layout'))
const StrengthList = lazy(() => import('@/pages/soil-lab/experiments/strength/ui/list/List'))
const StrengthAdd = lazy(() => import('@/pages/soil-lab/experiments/strength/ui/Add'))
const StrengthDetails = lazy(() => import('@/pages/soil-lab/experiments/strength/ui/Details'))

export const strengthRoutes: AppRoute = {
  key: 'Strength',
  path: 'strength',
  label: 'Вимірювання міцності суміші',
  icon: FlaskConical,
  Component: StrengthLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'StrengthList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: StrengthList,
    },
    {
      key: 'StrengthAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: StrengthAdd,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_CREATE],
    },
    {
      key: 'StrengthDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: StrengthLayout,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_READ],
      children: [
        {
          key: 'StrengthIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: StrengthDetails,
        },
      ],
    },
  ],
}
