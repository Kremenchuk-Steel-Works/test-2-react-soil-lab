import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type BulkDensityArgs = {
  m: number
  V: number
}

/** Насипна щільність (вага) у г/см³: ρ = m / V */
export const BULK_DENSITY_TRANSFORM: TransformSpec<BulkDensityArgs> = {
  id: 'bulkDensity',
  inputs: ['m', 'V'] as const,
  compute({ m, V }) {
    return m / V
  },
  unit: Units.G_PER_CM3,
}
