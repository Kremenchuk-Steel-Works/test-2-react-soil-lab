import { Units } from '@/shared/lib/zod/unit-conversion/unit-registry'
import type { UnitConversionConfig } from '@/shared/lib/zod/unit-conversion/unit-types'

export const PRESSURE_CONVERSIONS = [
  { from: Units.N_PER_CM2, to: Units.KGF_PER_CM2, formula: (x) => x / 9.80665 },
  { from: Units.KGF_PER_CM2, to: Units.N_PER_CM2, formula: (x) => x * 9.80665 },
  { from: Units.K_PA, to: Units.KGF_PER_CM2, formula: (x) => x / 98.0665 },
  { from: Units.KGF_PER_CM2, to: Units.K_PA, formula: (x) => x * 98.0665 },
] as const satisfies UnitConversionConfig[]
