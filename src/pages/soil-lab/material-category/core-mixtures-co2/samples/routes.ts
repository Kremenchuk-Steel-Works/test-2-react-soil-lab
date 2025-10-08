import { lazy } from 'react'
import { CirclePlus, ClipboardList, Info, RefreshCcw } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'

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
    buttons: [PageAction.create],
    actionPermissions: {
      [PageAction.create]: [PERMISSIONS.SAMPLES_CREATE],
    },
  },
  children: [
    {
      index: true,
      Component: SamplesListPage,
    },
    {
      key: 'coreMixturesCO2SamplesAdd',
      path: segment(PageAction.create),
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
        buttons: [PageAction.update],
        actionPermissions: {
          [PageAction.update]: [PERMISSIONS.SAMPLES_CREATE],
          [PageAction.delete]: [PERMISSIONS.SAMPLES_DELETE],
        },
      },
      children: [
        {
          index: true,
          Component: SamplesDetailsPage,
        },
        {
          key: 'coreMixturesCO2SamplesUpdate',
          path: segment(PageAction.update),
          label: 'Оновити',
          icon: RefreshCcw,
          Component: TestsAddPage,
          requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
        },
      ],
    },
  ],
}
