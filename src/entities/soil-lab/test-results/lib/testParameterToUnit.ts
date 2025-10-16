import { testResultParametersFieldRegistry } from '@/entities/soil-lab/parameters/model/fields-registry'
import { TestResultParameters } from '@/entities/soil-lab/parameters/model/parameters'

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
} = testResultParametersFieldRegistry

// enum -> ключ в Field Registry
const FR_KEY_BY_TYPE: Readonly<
  Record<TestResultParameters, keyof typeof testResultParametersFieldRegistry>
> = {
  [TestResultParameters.gas_permeability]: gasPermeability.key,
  [TestResultParameters.moisture_percent]: moisturePercent.key,
  [TestResultParameters.compressive_strength]: compressiveStrength.key,
  [TestResultParameters.tensile_strength]: tensileStrength.key,
  [TestResultParameters.tensile_strength_after_0_hours]: tensileStrengthAfter0Hours.key,
  [TestResultParameters.tensile_strength_after_1_hour]: tensileStrengthAfter1Hour.key,
  [TestResultParameters.tensile_strength_after_3_hours]: tensileStrengthAfter3Hours.key,
  [TestResultParameters.tensile_strength_after_24_hours]: tensileStrengthAfter24Hours.key,
  [TestResultParameters.gas_forming_property]: gasFormingProperty.key,
} as const

// Достаём символ единицы из FR
export function testTypeToUnit(testType: TestResultParameters): string {
  const frKey = FR_KEY_BY_TYPE[testType]
  // если чего-то нет — вернём пустую строку, чтобы не ломать UI
  return testResultParametersFieldRegistry[frKey]?.label?.defaultUnit ?? ''
}
