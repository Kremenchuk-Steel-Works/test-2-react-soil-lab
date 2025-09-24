import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

const strengthBaseFieldRegistry = createFieldRegistry({
  compressiveStrength: {
    label: { default: 'Міцність на стиск (Н/см²)' },
  },
} as const)

export const strengthFieldRegistry = {
  ...experimentsFieldRegistry,
  ...strengthBaseFieldRegistry,
}
