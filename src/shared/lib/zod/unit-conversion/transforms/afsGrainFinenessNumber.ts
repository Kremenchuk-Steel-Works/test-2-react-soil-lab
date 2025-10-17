import { Transforms } from '@/shared/lib/zod/unit-conversion/transforms'
import { withFormulaTransform } from '@/shared/lib/zod/unit-conversion/withFormulaTransform'
import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

/**
 * Ключи «сырых» входов: массы остатков по ситам + общая масса навески.
 * Важно: список сит соответствует стандартным множителям AFS.
 */
const SIEVE_MASS_KEYS = [
  'sieve1p25MmMass',
  'sieve1MmMass',
  'sieve0p7MmMass',
  'sieve0p5MmMass',
  'sieve0p355MmMass',
  'sieve0p25MmMass',
  'sieve0p18MmMass',
  'sieve0p125MmMass',
  'sieve0p09MmMass',
  'sieve0p063MmMass',
  'panMass',
] as const

type SieveKey = (typeof SIEVE_MASS_KEYS)[number]

export type AfsGrainFinenessNumberMassArgs = Readonly<
  Record<SieveKey | 'initialSampleMass', number>
>

/**
 * Фиксированные множители AFS для каждого сита.
 * Проверяем полноту ключей типом satisfies.
 */
const MULTIPLIERS = {
  sieve1p25MmMass: 10,
  sieve1MmMass: 15,
  sieve0p7MmMass: 18,
  sieve0p5MmMass: 25,
  sieve0p355MmMass: 35,
  sieve0p25MmMass: 45,
  sieve0p18MmMass: 60,
  sieve0p125MmMass: 80,
  sieve0p09MmMass: 120,
  sieve0p063MmMass: 170,
  panMass: 230,
} as const satisfies Record<SieveKey, number>

/**
 * Показник AFS (GFN) из СЫРЫХ масс:
 * 1) Для каждого сита считаем процент через универсальную формулу: (m1 / m) * 100
 * 2) Применяем множители AFS и делим на 100: GFN = Σ(p_i * k_i) / 100
 */
export const AFS_GRAIN_FINENESS_NUMBER_TRANSFORM: TransformSpec<AfsGrainFinenessNumberMassArgs> = {
  id: 'afsGrainFinenessNumber',
  inputs: [...SIEVE_MASS_KEYS, 'initialSampleMass'] as const,
  compute(a) {
    const m = a.initialSampleMass
    if (!Number.isFinite(m) || m <= 0) return Number.NaN

    let weightedSum = 0

    for (const key of SIEVE_MASS_KEYS) {
      const m1 = a[key]
      if (!Number.isFinite(m1) || m1 < 0) return Number.NaN

      const percent = withFormulaTransform({
        transform: Transforms.PARTICLE_SIZE_DISTRIBUTION_TRANSFORM,
        known: { m, m1 },
      })

      weightedSum += percent * MULTIPLIERS[key]
    }

    return weightedSum / 100
  },
  unit: Units.PN,
}
