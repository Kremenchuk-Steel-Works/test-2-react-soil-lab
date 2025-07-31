import { lazy } from 'react'
import { CirclePlus, Database, FlaskConical, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const MoldExperimentLayout = lazy(() => import('@/pages/molding-shop/mold-experiment/Layout'))
const MoldExperimentList = lazy(() => import('@/pages/molding-shop/mold-experiment/list/List'))
const MoldExperimentAdd = lazy(() => import('@/pages/molding-shop/mold-experiment/Add'))
const MoldExperimentDetails = lazy(() => import('@/pages/molding-shop/mold-experiment/Details'))
const MoldExperimentUpdate = lazy(() => import('@/pages/molding-shop/mold-experiment/Update'))

export const moldExperimentRoutes: AppRoute = {
  key: 'MoldExperiment',
  path: 'mold-experiment',
  label: 'Експеримент',
  icon: FlaskConical,
  Component: MoldExperimentLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MoldExperimentList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MoldExperimentList,
    },
    {
      key: 'MoldExperimentAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MoldExperimentAdd,
    },
    {
      key: 'MoldExperimentDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MoldExperimentDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'MoldExperimentUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: MoldExperimentUpdate,
    },
  ],
}
