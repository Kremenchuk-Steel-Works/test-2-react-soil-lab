import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const experimentsFieldRegistry = createFieldRegistry({
  moldingSandNumber: {
    label: { default: '№ суміші' },
  },
  machineType: {
    label: {
      default: 'Тип установки',
    },
  },
  ambientTempMoldAssemblyArea: {
    label: {
      default: 'Температура на дільниці (°C)',
    },
  },
} as const)
