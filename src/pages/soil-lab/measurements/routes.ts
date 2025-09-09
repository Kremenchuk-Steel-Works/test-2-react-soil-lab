import { lazy } from 'react'
import { CirclePlus, Database, Info, RefreshCcw, TestTubeDiagonal, Trash } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const MeasurementsLayout = lazy(() => import('@/pages/soil-lab/measurements/ui/Layout'))
const MeasurementsList = lazy(() => import('@/pages/soil-lab/measurements/ui/list/List'))
const MeasurementsAdd = lazy(() => import('@/pages/soil-lab/measurements/ui/Add'))
const MeasurementsDelete = lazy(() => import('@/pages/soil-lab/measurements/ui/Delete'))
const MeasurementsDetails = lazy(() => import('@/pages/soil-lab/measurements/ui/Details'))
const MeasurementsUpdate = lazy(() => import('@/pages/soil-lab/measurements/ui/Update'))

export const measurementsRoutes: AppRoute = {
  key: 'Measurements',
  path: 'measurements',
  label: 'Вимірювання суміші',
  icon: TestTubeDiagonal,
  Component: MeasurementsLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MeasurementsList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MeasurementsList,
    },
    {
      key: 'MeasurementsAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MeasurementsAdd,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_CREATE],
    },
    {
      key: 'MeasurementsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MeasurementsLayout,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_READ],
      meta: {
        buttons: ['update'],
      },
      children: [
        {
          key: 'MeasurementsIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: MeasurementsDetails,
        },
        {
          key: 'MeasurementsDelete',
          path: 'delete',
          label: 'Видалити',
          icon: Trash,
          Component: MeasurementsDelete,
          requiredPermissions: [PERMISSIONS.MEASUREMENTS_DELETE],
        },
        {
          key: 'MeasurementsUpdate',
          path: 'update',
          label: 'Оновити',
          icon: RefreshCcw,
          Component: MeasurementsUpdate,
          requiredPermissions: [PERMISSIONS.MEASUREMENTS_UPDATE],
        },
      ],
    },
  ],
}
