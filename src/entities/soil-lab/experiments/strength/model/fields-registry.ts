import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

const moisureBaseFieldRegistry = createFieldRegistry({
  compressiveStrength: {
    label: { default: 'Міцність на стискання (Н/см²)' },
  },
} as const)

export const strengthFieldRegistry = {
  ...experimentsFieldRegistry,
  ...moisureBaseFieldRegistry,
}
