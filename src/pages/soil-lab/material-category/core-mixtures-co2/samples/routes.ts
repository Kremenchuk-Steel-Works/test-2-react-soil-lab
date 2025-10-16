import { lazy } from 'react'
import { CirclePlus, ClipboardList, Info, RefreshCcw } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, segment, type AppRoute } from '@/app/routes/types'
import { createRouteKeyNs } from '@/app/routes/utils/route-key'
import { samplesMaterialTypesLabels } from '@/entities/soil-lab/materialTypes/model/materialTypes'

const SamplesListPage = lazy(() => import('./ui/list/List'))
const SamplesNewPage = lazy(() => import('./ui/New'))
const SamplesLayoutPage = lazy(() => import('@/pages/soil-lab/samples/ui/Layout'))
const SamplesDetailsPage = lazy(() => import('@/pages/soil-lab/samples/ui/Details'))
const TestsNewPage = lazy(() => import('@/pages/soil-lab/tests/ui/New'))

const { coreMixturesCO2 } = samplesMaterialTypesLabels
const routeKeys = createRouteKeyNs('soilLab', 'coreMixturesCO2', 'samples')

export const coreMixturesCO2SamplesRoutes: AppRoute = {
  key: routeKeys(),
  path: 'core-mixtures-co2',
  label: coreMixturesCO2,
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
      key: routeKeys(segment(PageAction.create)),
      path: segment(PageAction.create),
      label: 'Додати',
      icon: CirclePlus,
      Component: SamplesNewPage,
      requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
    },
    {
      key: routeKeys('detail'),
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
          key: routeKeys(segment(PageAction.update)),
          path: segment(PageAction.update),
          label: 'Оновити',
          icon: RefreshCcw,
          Component: TestsNewPage,
          requiredPermissions: [PERMISSIONS.SAMPLES_CREATE],
        },
      ],
    },
  ],
}
