// import { lazy } from 'react'
// import { CirclePlus, Container, Database, Info, RefreshCcw } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'

// const MoldingSandTypeLayout = lazy(() => import('@/pages/molding-shop/molding-sand-type/Layout'))
// const MoldingSandTypeList = lazy(() => import('@/pages/molding-shop/molding-sand-type/list/List'))
// const MoldingSandTypeAdd = lazy(() => import('@/pages/molding-shop/molding-sand-type/Add'))
// const MoldingSandTypeDetails = lazy(() => import('@/pages/molding-shop/molding-sand-type/Details'))
// const MoldingSandTypeUpdate = lazy(() => import('@/pages/molding-shop/molding-sand-type/Update'))

// export const moldingSandTypeRoutes: AppRoute = {
//   key: 'MoldingSandType',
//   path: 'molding-sand-type',
//   label: 'Тип формувальної суміші',
//   icon: Container,
//   Component: MoldingSandTypeLayout,
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'MoldingSandTypeList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: MoldingSandTypeList,
//     },
//     {
//       key: 'MoldingSandTypeAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: MoldingSandTypeAdd,
//     },
//     {
//       key: 'MoldingSandTypeDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: MoldingSandTypeDetails,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'MoldingSandTypeUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: MoldingSandTypeUpdate,
//     },
//   ],
// }
