import { lazy } from 'react'
import { CirclePlus, ClipboardList, Database, Info, RefreshCcw, Trash } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const SamplesLayout = lazy(() => import('@/pages/soil-lab/samples/ui/Layout'))
const SamplesList = lazy(() => import('@/pages/soil-lab/samples/ui/list/List'))
const SamplesAdd = lazy(() => import('@/pages/soil-lab/samples/ui/Add'))
const SamplesDelete = lazy(() => import('@/pages/soil-lab/samples/ui/Delete'))
const SamplesDetails = lazy(() => import('@/pages/soil-lab/samples/ui/Details'))
const TestsAdd = lazy(() => import('@/pages/soil-lab/tests/ui/Add'))

export const samplesRoutes: AppRoute = {
  key: 'samples',
  path: 'samples',
  label: 'Зразки',
  icon: ClipboardList,
  Component: SamplesLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'samplesList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: SamplesList,
    },
    {
      key: 'samplesAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: SamplesAdd,
      requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
    },
    {
      key: 'samplesDetail',
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
          key: 'samplesIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: SamplesDetails,
        },
        {
          key: 'samplesDelete',
          path: 'delete',
          label: 'Видалити',
          icon: Trash,
          Component: SamplesDelete,
          requiredPermissions: [PERMISSIONS.SAMPLES_DELETE],
        },
        {
          key: 'samplesUpdate',
          path: 'update',
          label: 'Оновити',
          icon: RefreshCcw,
          Component: TestsAdd,
          requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
        },
      ],
    },
  ],
}
