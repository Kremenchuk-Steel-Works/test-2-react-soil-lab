import { lazy } from 'react'
import { AirVent, CirclePlus, Database, Info } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const GasPermeabilityLayout = lazy(
  () => import('@/pages/soil-lab/experiments/gasPermeability/ui/Layout'),
)
const GasPermeabilityList = lazy(
  () => import('@/pages/soil-lab/experiments/gasPermeability/ui/list/List'),
)
const GasPermeabilityAdd = lazy(() => import('@/pages/soil-lab/experiments/gasPermeability/ui/Add'))
const GasPermeabilityDetails = lazy(
  () => import('@/pages/soil-lab/experiments/gasPermeability/ui/Details'),
)

export const gasPermeabilityRoutes: AppRoute = {
  key: 'GasPermeability',
  path: 'gasPermeability',
  label: 'Газопроникність',
  icon: AirVent,
  Component: GasPermeabilityLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'GasPermeabilityList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: GasPermeabilityList,
    },
    {
      key: 'GasPermeabilityAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: GasPermeabilityAdd,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_CREATE],
    },
    {
      key: 'GasPermeabilityDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: GasPermeabilityLayout,
      requiredPermissions: [PERMISSIONS.MEASUREMENTS_READ],
      children: [
        {
          key: 'GasPermeabilityIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: GasPermeabilityDetails,
        },
      ],
    },
  ],
}
