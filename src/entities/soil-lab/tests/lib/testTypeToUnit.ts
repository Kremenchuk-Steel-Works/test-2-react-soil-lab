import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { TestType } from '@/shared/api/soil-lab/model'

const { gasPermeability, moisturePercent, strength } = testsTypeFieldRegistry

// enum -> ключ в Field Registry
const FR_KEY_BY_TYPE: Readonly<Record<TestType, keyof typeof testsTypeFieldRegistry>> = {
  [TestType.gas_permeability]: gasPermeability.key,
  [TestType.moisture_percent]: moisturePercent.key,
  [TestType.strength]: strength.key,
} as const

// Достаём символ единицы из FR
export function testTypeToUnit(testType: TestType): string {
  const frKey = FR_KEY_BY_TYPE[testType]
  // если чего-то нет — вернём пустую строку, чтобы не ломать UI
  return testsTypeFieldRegistry[frKey]?.label?.defaultUnit ?? ''
}
