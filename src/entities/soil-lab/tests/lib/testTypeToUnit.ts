import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { TestType } from '@/shared/api/soil-lab/model'

const {
  gasPermeability,
  moisturePercent,
  compressiveStrength,
  tensileStrength,
  tensileStrengthAfter0Hours,
  tensileStrengthAfter1Hour,
  tensileStrengthAfter3Hours,
  tensileStrengthAfter24Hours,
  gasFormingProperty,
} = testsTypeFieldRegistry

// enum -> ключ в Field Registry
const FR_KEY_BY_TYPE: Readonly<Record<TestType, keyof typeof testsTypeFieldRegistry>> = {
  [TestType.gas_permeability]: gasPermeability.key,
  [TestType.moisture_percent]: moisturePercent.key,
  [TestType.compressive_strength]: compressiveStrength.key,
  [TestType.tensile_strength]: tensileStrength.key,
  [TestType.tensile_strength_after_0_hours]: tensileStrengthAfter0Hours.key,
  [TestType.tensile_strength_after_1_hour]: tensileStrengthAfter1Hour.key,
  [TestType.tensile_strength_after_3_hours]: tensileStrengthAfter3Hours.key,
  [TestType.tensile_strength_after_24_hours]: tensileStrengthAfter24Hours.key,
  [TestType.gas_forming_property]: gasFormingProperty.key,
} as const

// Достаём символ единицы из FR
export function testTypeToUnit(testType: TestType): string {
  const frKey = FR_KEY_BY_TYPE[testType]
  // если чего-то нет — вернём пустую строку, чтобы не ломать UI
  return testsTypeFieldRegistry[frKey]?.label?.defaultUnit ?? ''
}
