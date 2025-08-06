import { lazy } from 'react'
import { Factory, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
// import { castingPatternRoutes } from '@/entities/molding-shop/casting-pattern'
// import { castingProductRoutes } from '@/entities/molding-shop/casting-product'
// import { castingTechnologyRoutes } from '@/entities/molding-shop/casting-technology'
// import { coreBatchRoutes } from '@/entities/molding-shop/core-batch'
// import { coreMakingMachineRoutes } from '@/entities/molding-shop/core-making-machine'
// import { moldCoreTypeRoutes } from '@/entities/molding-shop/mold-core-type'
// import { moldExperimentRoutes } from '@/entities/molding-shop/mold-experiment'
import { moldPassportRoutes } from '@/entities/molding-shop/mold-passport'

// import { moldingAreaRoutes } from '@/entities/molding-shop/molding-area'
// import { moldingFlaskRoutes } from '@/entities/molding-shop/molding-flask'
// import { moldingSandTypeRoutes } from '@/entities/molding-shop/molding-sand-type'
// import { patternPlateFrameRoutes } from '@/entities/molding-shop/pattern-plate-frame'
// import { resinRoutes } from '@/entities/molding-shop/resin'
// import { triethylamineRoutes } from '@/entities/molding-shop/triethylamine'

const MoldingShopLayout = lazy(() => import('@/pages/molding-shop/Layout'))
const MoldingShopMain = lazy(() => import('@/pages/molding-shop/Main'))

export const moldingShopRoutes: AppRoute = {
  key: 'moldingShop',
  path: '/molding-shop',
  label: 'Формувальний цех',
  icon: Factory,
  Component: MoldingShopLayout,
  requiredPermissions: ['admin'],
  children: [
    {
      key: 'moldingShopIndex',
      path: '',
      label: '',
      icon: Users,
      Component: MoldingShopMain,
      inSidebar: false,
    },
    moldPassportRoutes,
    // moldingAreaRoutes,
    // castingTechnologyRoutes,
    // patternPlateFrameRoutes,
    // moldingFlaskRoutes,
    // moldExperimentRoutes,
    // moldingSandTypeRoutes,
    // castingProductRoutes,
    // castingPatternRoutes,
    // moldCoreTypeRoutes,
    // coreMakingMachineRoutes,
    // resinRoutes,
    // triethylamineRoutes,
    // coreBatchRoutes,
  ],
}
