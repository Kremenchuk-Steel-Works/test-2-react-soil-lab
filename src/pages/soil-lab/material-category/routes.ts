import type { AppRoute } from '@/app/routes/types'
import { materialCategoryCoreMixturesCO2Routes } from '@/pages/soil-lab/material-category/core-mixtures-co2/routes'
import { materialCategoryMoldingMixturesRoutes } from '@/pages/soil-lab/material-category/molding-mixtures/routes'

export const samplesMaterialCategoryRoutes: AppRoute[] = [
  materialCategoryMoldingMixturesRoutes,
  materialCategoryCoreMixturesCO2Routes,
]
