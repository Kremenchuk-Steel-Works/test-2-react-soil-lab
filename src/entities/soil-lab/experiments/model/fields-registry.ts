import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const EXPERIMENTS = createFieldRegistry({
  moldingSandNumber: {
    label: { default: '№ суміші' },
  },
  ambientTempMoldAssemblyArea: {
    label: {
      default: 'Температура на дільниці (°C)',
      short: 'Температура (°C)',
    },
  },

  measurements: {
    label: { default: 'Значення' },
  },

  moistureContentPercent: {
    label: { default: 'Масова частка вологи (%)' },
  },
} as const)
