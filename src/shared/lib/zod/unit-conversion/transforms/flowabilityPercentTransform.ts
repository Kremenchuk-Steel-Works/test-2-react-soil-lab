import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type FlowabilityPercentArgs = {
  hA: number
  hB: number
}

/** Плинність, % (П = (hA * 100) / hB) */
export const FLOWABILITY_PERCENT_TRANSFORM: TransformSpec<FlowabilityPercentArgs> = {
  id: 'flowabilityPercent',
  inputs: ['hA', 'hB'] as const,
  compute({ hA, hB }) {
    // Защита от деления на 0
    if (hB <= 0) return Number.NaN
    return (hA * 100) / hB
  },
  unit: Units.PERCENT,
}
