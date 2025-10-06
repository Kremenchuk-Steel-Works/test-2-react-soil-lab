import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import type { TestType } from '@/shared/api/soil-lab/model'
import { dictToOptions } from '@/utils/dict'

const {
  compressiveStrength,
  gasPermeability,
  moisturePercent,
  tensileStrength,
  tensileStrengthAfter0Hours,
  tensileStrengthAfter1Hour,
  tensileStrengthAfter3Hours,
  tensileStrengthAfter24Hours,
  gasFormingProperty,
} = testsTypeFieldRegistry

export const testsTypeLabels: Record<TestType, string> = {
  compressive_strength: compressiveStrength.label.short,
  gas_permeability: gasPermeability.label.short,
  moisture_percent: moisturePercent.label.short,
  tensile_strength: tensileStrength.label.short,
  tensile_strength_after_0_hours: tensileStrengthAfter0Hours.label.short,
  tensile_strength_after_1_hour: tensileStrengthAfter1Hour.label.short,
  tensile_strength_after_3_hours: tensileStrengthAfter3Hours.label.short,
  tensile_strength_after_24_hours: tensileStrengthAfter24Hours.label.short,
  gas_forming_property: gasFormingProperty.label.short,
} as const

export const testsTypeOptions = dictToOptions(testsTypeLabels)
