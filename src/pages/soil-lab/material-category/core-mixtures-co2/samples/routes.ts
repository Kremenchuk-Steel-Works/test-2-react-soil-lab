import { lazy } from 'react'
import { CirclePlus, ClipboardList, Database, Info, RefreshCcw } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageButtonType, type AppRoute } from '@/app/routes/types'

const SamplesListPage = lazy(() => import('./ui/list/List'))
const SamplesAddPage = lazy(() => import('./ui/Add'))
const SamplesLayoutPage = lazy(() => import('@/pages/soil-lab/samples/ui/Layout'))
const SamplesDetailsPage = lazy(() => import('@/pages/soil-lab/samples/ui/Details'))
const TestsAddPage = lazy(() => import('@/pages/soil-lab/tests/ui/Add'))

export const coreMixturesCO2SamplesRoutes: AppRoute = {
  key: 'coreMixturesCO2Samples',
  path: 'samples',
  label: 'Зразки',
  icon: ClipboardList,
  Component: SamplesLayoutPage,
  requiredPermissions: [PERMISSIONS.SAMPLES_READ],
  meta: {
    buttons: [PageButtonType.add],
    actionPermissions: {
      add: [PERMISSIONS.SAMPLES_CREATE],
    },
  },
  children: [
    {
      key: '',
      path: '',
      label: '',
      icon: Database,
      Component: SamplesListPage,
    },
    {
      key: 'coreMixturesCO2SamplesAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: SamplesAddPage,
      requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
    },
    {
      key: 'coreMixturesCO2SamplesDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: SamplesLayoutPage,
      requiredPermissions: [PERMISSIONS.SAMPLES_READ],
      meta: {
        buttons: [PageButtonType.update],
        actionPermissions: {
          update: [PERMISSIONS.SAMPLES_CREATE],
          delete: [PERMISSIONS.SAMPLES_DELETE],
        },
      },
      children: [
        {
          key: '',
          path: '',
          label: '',
          icon: Info,
          Component: SamplesDetailsPage,
        },
        {
          key: 'coreMixturesCO2SamplesUpdate',
          path: 'update',
          label: 'Оновити',
          icon: RefreshCcw,
          Component: TestsAddPage,
          requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
        },
      ],
    },
  ],
}
