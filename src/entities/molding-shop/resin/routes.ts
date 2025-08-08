// import { lazy } from 'react'
// import { Beaker, CirclePlus, Database, Info, RefreshCcw } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'

// const ResinLayout = lazy(() => import('@/pages/molding-shop/resin/Layout'))
// const ResinList = lazy(() => import('@/pages/molding-shop/resin/list/List'))
// const ResinAdd = lazy(() => import('@/pages/molding-shop/resin/Add'))
// const ResinDetails = lazy(() => import('@/pages/molding-shop/resin/Details'))
// const ResinUpdate = lazy(() => import('@/pages/molding-shop/resin/Update'))

// export const resinRoutes: AppRoute = {
//   key: 'Resin',
//   path: 'resin',
//   label: 'Смола',
//   icon: Beaker,
//   Component: ResinLayout,
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'ResinList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: ResinList,
//     },
//     {
//       key: 'ResinAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: ResinAdd,
//     },
//     {
//       key: 'ResinDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: ResinDetails,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'ResinUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: ResinUpdate,
//     },
//   ],
// }
