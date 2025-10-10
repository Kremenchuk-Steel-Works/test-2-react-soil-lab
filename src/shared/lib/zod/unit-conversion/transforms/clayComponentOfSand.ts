import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type ClayArgs = { m1: number; m: number }

/** Масова частка глинистих частинок у піску, % = (m1 / m) * 100 */
export const CLAY_COMPONENT_OF_SAND_TRANSFORM: TransformSpec<ClayArgs> = {
  id: 'clayComponentOfSand',
  inputs: ['m1', 'm'] as const,
  compute({ m1, m }) {
    return (m1 / m) * 100
  },
  unit: Units.PERCENT,
}
