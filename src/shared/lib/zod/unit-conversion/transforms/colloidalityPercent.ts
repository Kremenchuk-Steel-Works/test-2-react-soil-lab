import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type ColloidalityPercentArgs = {
  V1: number
  V: number
}

/** Колоїдальність, % */
export const COLLOIDALITY_PERCENT_TRANSFORM: TransformSpec<ColloidalityPercentArgs> = {
  id: 'colloidalityPercent',
  inputs: ['V1', 'V'] as const,
  compute({ V1, V }) {
    return (V1 * 100) / V
  },
  unit: Units.PERCENT,
}
