import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import type { TestType } from '@/shared/api/soil-lab/model'
import { dictToOptions } from '@/utils/dict'

const { strength, gasPermeability, moisturePercent } = testsTypeFieldRegistry

export const testsType: Record<TestType, string> = {
  strength: strength.label.short,
  gas_permeability: gasPermeability.label.short,
  moisture_percent: moisturePercent.label.short,
} as const

export const testsTypeOptions = dictToOptions(testsType)
