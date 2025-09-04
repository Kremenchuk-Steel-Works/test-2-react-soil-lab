// import { lazy } from 'react'
// import { CirclePlus, Database, Info, MemoryStick, RefreshCcw } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'

// const CastingTechnologyLayout = lazy(() => import('@/pages/molding-shop/casting-technology/Layout'))
// const CastingTechnologyList = lazy(
//   () => import('@/pages/molding-shop/casting-technology/list/List'),
// )
// const CastingTechnologyAdd = lazy(() => import('@/pages/molding-shop/casting-technology/Add'))
// const CastingTechnologyDetails = lazy(
//   () => import('@/pages/molding-shop/casting-technology/Details'),
// )
// const CastingTechnologyUpdate = lazy(() => import('@/pages/molding-shop/casting-technology/Update'))

// export const castingTechnologyRoutes: AppRoute = {
//   key: 'CastingTechnology',
//   path: 'casting-technology',
//   label: 'Технологія формовки',
//   icon: MemoryStick,
//   Component: CastingTechnologyLayout,
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'CastingTechnologyList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: CastingTechnologyList,
//     },
//     {
//       key: 'CastingTechnologyAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: CastingTechnologyAdd,
//     },
//     {
//       key: 'CastingTechnologyDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: CastingTechnologyDetails,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'CastingTechnologyUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: CastingTechnologyUpdate,
//     },
//   ],
// }
