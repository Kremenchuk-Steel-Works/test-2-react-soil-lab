import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const testsFieldRegistry = createFieldRegistry({
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
