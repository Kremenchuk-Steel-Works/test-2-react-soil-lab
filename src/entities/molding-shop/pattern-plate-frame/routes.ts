// import { lazy } from 'react'
// import { CirclePlus, Database, Info, RefreshCcw, Scan } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'

// const PatternPlateFrameLayout = lazy(
//   () => import('@/pages/molding-shop/pattern-plate-frame/Layout'),
// )
// const PatternPlateFrameList = lazy(
//   () => import('@/pages/molding-shop/pattern-plate-frame/list/List'),
// )
// const PatternPlateFrameAdd = lazy(() => import('@/pages/molding-shop/pattern-plate-frame/Add'))
// const PatternPlateFrameDetails = lazy(
//   () => import('@/pages/molding-shop/pattern-plate-frame/Details'),
// )
// const PatternPlateFrameUpdate = lazy(
//   () => import('@/pages/molding-shop/pattern-plate-frame/Update'),
// )

// export const patternPlateFrameRoutes: AppRoute = {
//   key: 'PatternPlateFrame',
//   path: 'pattern-plate-frame',
//   label: 'Модельна рамка',
//   icon: Scan,
//   Component: PatternPlateFrameLayout,
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'PatternPlateFrameList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: PatternPlateFrameList,
//     },
//     {
//       key: 'PatternPlateFrameAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: PatternPlateFrameAdd,
//     },
//     {
//       key: 'PatternPlateFrameDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: PatternPlateFrameDetails,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'PatternPlateFrameUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: PatternPlateFrameUpdate,
//     },
//   ],
// }
