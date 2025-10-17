import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type CompactabilityArgs = {
  H: number
  H1: number
}

/** Ущільнювальність, % */
export const COMPACTABILITY_PERCENT_TRANSFORM: TransformSpec<CompactabilityArgs> = {
  id: 'compactabilityPercent',
  inputs: ['H', 'H1'] as const,
  compute({ H, H1 }) {
    return ((H - H1) / H) * 100
  },
  unit: Units.PERCENT,
}
