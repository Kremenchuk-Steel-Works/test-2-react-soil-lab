import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const MEASUREMENTS = createFieldRegistry({
  moldingSandNumber: {
    label: { default: '№ суміші' },
  },
  moldingSandStrengthKgfCm2: {
    label: { default: 'Міцність на стиск (кгс/см²)' },
  },
  moldingSandGasPermeability: {
    label: { default: 'Газопроникність (од.)' },
  },
  moldingSandMoisturePercent: {
    label: { default: 'Вологість (%)' },
  },
  note: {
    label: { default: 'Примітка' },
  },
  performedAt: {
    label: { default: 'Дата й час вимірювання' },
  },
} as const)
