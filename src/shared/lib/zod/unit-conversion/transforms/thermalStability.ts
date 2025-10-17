import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

export type ThermalStabilityArgs = {
  sigma1: number
  sigma2: number
}

/**
 * Термічна стійкість: T = σ1 / σ2 (од.)
 * σ1, σ2 — міцність при стисканні у КГС/см².
 */
export const THERMAL_STABILITY_TRANSFORM: TransformSpec<ThermalStabilityArgs> = {
  id: 'thermalStability',
  inputs: ['sigma1', 'sigma2'] as const,
  compute({ sigma1, sigma2 }) {
    // Conversion
    const sigma1_converted = withUnitConversion(sigma1, {
      from: Units.N_PER_CM2,
      to: Units.KGF_PER_CM2,
      round: 2,
    })
    const sigma2_converted = withUnitConversion(sigma2, {
      from: Units.N_PER_CM2,
      to: Units.KGF_PER_CM2,
      round: 2,
    })
    return sigma1_converted / sigma2_converted
  },
  unit: Units.PN,
}
