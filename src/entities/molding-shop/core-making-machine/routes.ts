import { lazy } from 'react'
import { CirclePlus, Database, Info, MemoryStick, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const CoreMakingMachineLayout = lazy(
  () => import('@/pages/molding-shop/core-making-machine/Layout'),
)
const CoreMakingMachineList = lazy(
  () => import('@/pages/molding-shop/core-making-machine/list/List'),
)
const CoreMakingMachineAdd = lazy(() => import('@/pages/molding-shop/core-making-machine/Add'))
const CoreMakingMachineDetails = lazy(
  () => import('@/pages/molding-shop/core-making-machine/Details'),
)
const CoreMakingMachineUpdate = lazy(
  () => import('@/pages/molding-shop/core-making-machine/Update'),
)

export const coreMakingMachineRoutes: AppRoute = {
  key: 'CoreMakingMachine',
  path: 'core-making-machine',
  label: 'Технологія формовки',
  icon: MemoryStick,
  Component: CoreMakingMachineLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'CoreMakingMachineList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: CoreMakingMachineList,
    },
    {
      key: 'CoreMakingMachineAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: CoreMakingMachineAdd,
    },
    {
      key: 'CoreMakingMachineDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: CoreMakingMachineDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'CoreMakingMachineUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: CoreMakingMachineUpdate,
    },
  ],
}
