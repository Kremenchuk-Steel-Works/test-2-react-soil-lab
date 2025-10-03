import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { TestType } from '@/shared/api/soil-lab/model'

const {
  gasPermeability,
  moisturePercent,
  strength,
  tensileStrength,
  tensileStrength0h,
  tensileStrength1h,
  tensileStrength3h,
  tensileStrength24h,
  gasEvolution,
} = testsTypeFieldRegistry

// enum -> ключ в Field Registry
const FR_KEY_BY_TYPE: Readonly<Record<TestType, keyof typeof testsTypeFieldRegistry>> = {
  [TestType.gas_permeability]: gasPermeability.key,
  [TestType.moisture_percent]: moisturePercent.key,
  [TestType.strength]: strength.key,
  [TestType.tensile_strength]: tensileStrength.key,
  [TestType.tensile_strength_0h]: tensileStrength0h.key,
  [TestType.tensile_strength_1h]: tensileStrength1h.key,
  [TestType.tensile_strength_3h]: tensileStrength3h.key,
  [TestType.tensile_strength_24h]: tensileStrength24h.key,
  [TestType.gas_evolution]: gasEvolution.key,
} as const

// Достаём символ единицы из FR
export function testTypeToUnit(testType: TestType): string {
  const frKey = FR_KEY_BY_TYPE[testType]
  // если чего-то нет — вернём пустую строку, чтобы не ломать UI
  return testsTypeFieldRegistry[frKey]?.label?.defaultUnit ?? ''
}
