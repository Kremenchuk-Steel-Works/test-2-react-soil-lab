import { lazy } from 'react'
import { CirclePlus, Database, Info, Layers, RefreshCcw, Trash } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const MoldPassportLayout = lazy(() => import('@/pages/molding-shop/mold-passport/Layout'))
const MoldPassportList = lazy(() => import('@/pages/molding-shop/mold-passport/list/List'))
const MoldPassportAdd = lazy(() => import('@/pages/molding-shop/mold-passport/Add'))
const MoldPassportDelete = lazy(() => import('@/pages/molding-shop/mold-passport/Delete'))
const MoldPassportDetails = lazy(() => import('@/pages/molding-shop/mold-passport/Details'))
const MoldPassportUpdate = lazy(() => import('@/pages/molding-shop/mold-passport/Update'))

export const moldPassportRoutes: AppRoute = {
  key: 'MoldPassport',
  path: 'mold-passport',
  label: 'Паспорт ливарної форми',
  icon: Layers,
  Component: MoldPassportLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MoldPassportList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MoldPassportList,
    },
    {
      key: 'MoldPassportAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MoldPassportAdd,
    },
    {
      key: 'MoldPassportDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MoldPassportLayout,
      meta: {
        buttons: ['update'],
      },
      children: [
        {
          key: 'MoldPassportDetailIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: MoldPassportDetails,
        },
        {
          key: 'MoldPassportDelete',
          path: 'delete',
          label: 'Видалити',
          icon: Trash,
          Component: MoldPassportDelete,
        },
        {
          key: 'MoldPassportUpdate',
          path: 'update',
          label: 'Оновити',
          icon: RefreshCcw,
          Component: MoldPassportUpdate,
        },
      ],
    },
  ],
}
