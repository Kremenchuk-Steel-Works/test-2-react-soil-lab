import { lazy } from 'react'
import { CirclePlus, Database, Info, RefreshCcw, TestTubeDiagonal } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const SamplesLayout = lazy(() => import('@/pages/soil-lab/samples/ui/Layout'))
const SamplesList = lazy(() => import('@/pages/soil-lab/samples/ui/list/List'))
const SamplesAdd = lazy(() => import('@/pages/soil-lab/samples/ui/Add'))
// const SamplesDelete = lazy(() => import('@/pages/soil-lab/samples/ui/Delete'))
const SamplesDetails = lazy(() => import('@/pages/soil-lab/samples/ui/Details'))
const SamplesUpdate = lazy(() => import('@/pages/soil-lab/samples/ui/Update'))

export const samplesRoutes: AppRoute = {
  key: 'Samples',
  path: 'samples',
  label: 'Вимірювання суміші',
  icon: TestTubeDiagonal,
  Component: SamplesLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'SamplesList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: SamplesList,
    },
    {
      key: 'SamplesAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: SamplesAdd,
      requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
    },
    {
      key: 'SamplesDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: SamplesLayout,
      requiredPermissions: [PERMISSIONS.SAMPLES_READ],
      meta: {
        buttons: ['update'],
      },
      children: [
        {
          key: 'SamplesIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: SamplesDetails,
        },
        // {
        //   key: 'SamplesDelete',
        //   path: 'delete',
        //   label: 'Видалити',
        //   icon: Trash,
        //   Component: SamplesDelete,
        //   requiredPermissions: [PERMISSIONS.SAMPLES_DELETE],
        // },
        {
          key: 'SamplesUpdate',
          path: 'update',
          label: 'Оновити',
          icon: RefreshCcw,
          Component: SamplesUpdate,
          requiredPermissions: [PERMISSIONS.SAMPLES_UPDATE],
        },
      ],
    },
  ],
}
