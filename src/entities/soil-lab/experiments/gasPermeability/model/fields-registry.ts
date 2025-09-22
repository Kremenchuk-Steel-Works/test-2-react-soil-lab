import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

const gasPermeabilityBaseFieldRegistry = createFieldRegistry({
  gasPermeability: {
    label: { default: 'Газопроникність · 10⁻⁸ (m²/Pa·S)' },
  },
} as const)

export const gasPermeabilityFieldRegistry = {
  ...experimentsFieldRegistry,
  ...gasPermeabilityBaseFieldRegistry,
}
