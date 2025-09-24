import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const MEASUREMENTS = createFieldRegistry({
  moldingSandNumber: {
    label: { default: '№ суміші' },
  },
  moldingSandStrengthKgfCm2: {
    label: { default: 'Міцність на стиск (кгс/см²)', nPerCm2: 'Міцність на стиск (Н/см²)' },
  },
  moldingSandGasPermeability: {
    label: { default: 'Газопроникність (од.)', m2PerPas: 'Газопроникність · 10⁻⁸ (m²/Pa·S)' },
  },
  moldingSandMoisturePercent: {
    label: { default: 'Вологість (%)' },
  },
  note: {
    label: { default: 'Примітка' },
  },
  createdAt: {
    label: { default: 'Дата й час вимірювання' },
  },
} as const)
