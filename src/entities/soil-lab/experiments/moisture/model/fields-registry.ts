import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

const moisureBaseFieldRegistry = createFieldRegistry({
  moistureContentPercent: {
    label: { default: 'Масова частка вологи (%)' },
  },
} as const)

export const moistureFieldRegistry = {
  ...experimentsFieldRegistry,
  ...moisureBaseFieldRegistry,
}
