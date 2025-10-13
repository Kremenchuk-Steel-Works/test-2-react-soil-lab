import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type ParticleSizeDistributionArgs = { m: number; m1: number }

/** Гранулометричний склад (частка залишку на ситі), % */
export const PARTICLE_SIZE_DISTRIBUTION_TRANSFORM: TransformSpec<ParticleSizeDistributionArgs> = {
  id: 'particleSizeDistribution',
  inputs: ['m', 'm1'] as const,
  compute({ m, m1 }) {
    return (m1 / m) * 100
  },
  unit: Units.PERCENT,
}
