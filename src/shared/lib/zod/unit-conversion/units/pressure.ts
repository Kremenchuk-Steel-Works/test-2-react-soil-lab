import { Units, type UnitConversionConfig } from '@/shared/lib/zod/unit-conversion/unit-types'

export const PRESSURE_CONVERSIONS: UnitConversionConfig[] = [
  { from: Units.N_PER_CM2, to: Units.KGF_PER_CM2, formula: (x) => x / 9.80665 },
  { from: Units.KGF_PER_CM2, to: Units.N_PER_CM2, formula: (x) => x * 9.80665 },
]
