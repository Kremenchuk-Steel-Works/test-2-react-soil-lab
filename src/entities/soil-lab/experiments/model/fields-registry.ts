import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const experimentsFieldRegistry = createFieldRegistry({
  moldingSandNumber: {
    label: { default: '№ суміші' },
  },
  ambientTempMoldAssemblyArea: {
    label: {
      default: 'Температура на дільниці (°C)',
      short: 'Температура (°C)',
    },
  },
} as const)
