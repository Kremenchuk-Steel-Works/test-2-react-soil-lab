import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const testsFieldRegistry = createFieldRegistry({
  moldingSandRecipe: samplesFieldRegistry.moldingSandRecipe,
  sampleId: {
    label: { default: 'ID' },
  },
  type: {
    label: { default: 'Тип' },
  },
  measurement1: {
    label: { default: 'Значення' },
  },
} as const)

export const testsResponseFieldRegistry = createFieldRegistry({
  type: testsFieldRegistry.type,
  createdAt: {
    label: { default: 'Створено' },
  },
  meanMeasurement: {
    label: { default: 'Значення' },
  },
  status: {
    label: { default: 'Статус' },
  },
} as const)

export const testsTypeFieldRegistry = createFieldRegistry({
  strength: {
    label: {
      default: 'Міцність на стиск (кгс/см²)',
      nPerCm2: 'Міцність на стиск (Н/см²)',
      short: 'Міцність на стиск',
    },
  },
  gasPermeability: {
    label: {
      default: 'Газопроникність (од.)',
      m2PerPas: 'Газопроникність · 10⁻⁸ (m²/Pa·S)',
      short: 'Газопроникність',
    },
  },
  moisturePercent: {
    label: { default: 'Вологість (%)', short: 'Вологість' },
  },
} as const)
