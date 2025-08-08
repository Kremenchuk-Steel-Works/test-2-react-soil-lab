// import { lazy } from 'react'
// import { Boxes, CirclePlus, Database, Info, RefreshCcw } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'

// const CoreBatchLayout = lazy(() => import('@/pages/molding-shop/core-batch/Layout'))
// const CoreBatchList = lazy(() => import('@/pages/molding-shop/core-batch/list/List'))
// const CoreBatchAdd = lazy(() => import('@/pages/molding-shop/core-batch/Add'))
// const CoreBatchDetails = lazy(() => import('@/pages/molding-shop/core-batch/Details'))
// const CoreBatchUpdate = lazy(() => import('@/pages/molding-shop/core-batch/Update'))

// export const coreBatchRoutes: AppRoute = {
//   key: 'CoreBatch',
//   path: 'core-batch',
//   label: 'Партія стрижнів',
//   icon: Boxes,
//   Component: CoreBatchLayout,
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'CoreBatchList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: CoreBatchList,
//     },
//     {
//       key: 'CoreBatchAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: CoreBatchAdd,
//     },
//     {
//       key: 'CoreBatchDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: CoreBatchDetails,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'CoreBatchUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: CoreBatchUpdate,
//     },
//   ],
// }
