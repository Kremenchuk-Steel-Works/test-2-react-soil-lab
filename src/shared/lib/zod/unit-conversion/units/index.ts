import type { UnitConversionConfig } from '@/shared/lib/zod/unit-conversion/unit-types'
import { PERMEABILITY_CONVERSIONS } from './permeability'
import { PRESSURE_CONVERSIONS } from './pressure'

/** Единый список всех формул */
export const ALL_CONVERSIONS: UnitConversionConfig[] = [
  ...PRESSURE_CONVERSIONS,
  ...PERMEABILITY_CONVERSIONS,
]
