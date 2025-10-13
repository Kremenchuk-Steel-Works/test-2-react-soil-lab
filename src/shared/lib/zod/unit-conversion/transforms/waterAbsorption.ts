import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type WaterAbsorptionArgs = { m: number; m1: number }

/** Водопоглинання бентоніту: B = m1 / m (од.) */
export const WATER_ABSORPTION_TRANSFORM: TransformSpec<WaterAbsorptionArgs> = {
  id: 'waterAbsorption',
  inputs: ['m', 'm1'] as const,
  compute({ m, m1 }) {
    return m1 / m
  },
  unit: Units.PN,
}
