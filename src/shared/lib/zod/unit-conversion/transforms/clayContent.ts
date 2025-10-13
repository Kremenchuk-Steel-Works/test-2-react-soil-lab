import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type ClayContentArgs = { m: number; m1: number }

/** Глиниста складова, % */
export const CLAY_CONTENT_TRANSFORM: TransformSpec<ClayContentArgs> = {
  id: 'clayContent',
  inputs: ['m', 'm1'] as const,
  compute({ m, m1 }) {
    return ((m - m1) / m) * 100
  },
  unit: Units.PERCENT,
}
