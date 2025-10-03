import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import type { TestType } from '@/shared/api/soil-lab/model'
import { dictToOptions } from '@/utils/dict'

const {
  strength,
  gasPermeability,
  moisturePercent,
  tensileStrength,
  tensileStrength0h,
  tensileStrength1h,
  tensileStrength3h,
  tensileStrength24h,
  gasEvolution,
} = testsTypeFieldRegistry

export const testsTypeLabels: Record<TestType, string> = {
  strength: strength.label.short,
  gas_permeability: gasPermeability.label.short,
  moisture_percent: moisturePercent.label.short,
  tensile_strength: tensileStrength.label.short,
  tensile_strength_0h: tensileStrength0h.label.short,
  tensile_strength_1h: tensileStrength1h.label.short,
  tensile_strength_3h: tensileStrength3h.label.short,
  tensile_strength_24h: tensileStrength24h.label.short,
  gas_evolution: gasEvolution.label.short,
} as const

export const testsTypeOptions = dictToOptions(testsTypeLabels)
