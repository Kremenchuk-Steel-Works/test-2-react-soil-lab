import { testsTypeFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import type { TestType } from '@/shared/api/soil-lab-2/model'
import type { Option } from '@/shared/ui/select/ReactSelect'

const { strength, gasPermeability, moisturePercent } = testsTypeFieldRegistry

export const testsTypeOptions: Option<TestType>[] = [
  { value: 'strength', label: strength.label.short },
  { value: 'gas_permeability', label: gasPermeability.label.short },
  { value: 'moisture_percent', label: moisturePercent.label.short },
] as const
