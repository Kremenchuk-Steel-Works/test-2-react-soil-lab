import type { TransformSpec } from '../transform-types'
import { Units } from '../unit-registry'

/**
 * Ключи входов зафиксированы в одном месте — INPUTS.
 * Тип Args выводится из INPUTS как Record<key, number>, т.е. строго "словарь чисел".
 * Это удовлетворяет ограничению Args extends Record<string, number>.
 */
const INPUTS = [
  'sieve1p25MmPercent',
  'sieve1MmPercent',
  'sieve0p7MmPercent',
  'sieve0p5MmPercent',
  'sieve0p355MmPercent',
  'sieve0p25MmPercent',
  'sieve0p18MmPercent',
  'sieve0p125MmPercent',
  'sieve0p09MmPercent',
  'sieve0p063MmPercent',
  'panPercent',
] as const

export type AfsGrainFinenessNumberArgs = Record<(typeof INPUTS)[number], number>

/**
 * Фиксированные множители AFS для стандартного набора сит.
 * Через `satisfies Record<keyof Args, number>` компилятор проверит,
 * что перечислены все и только допустимые ключи.
 */
const MULTIPLYERS = {
  sieve1p25MmPercent: 10,
  sieve1MmPercent: 15,
  sieve0p7MmPercent: 18,
  sieve0p5MmPercent: 25,
  sieve0p355MmPercent: 35,
  sieve0p25MmPercent: 45,
  sieve0p18MmPercent: 60,
  sieve0p125MmPercent: 80,
  sieve0p09MmPercent: 120,
  sieve0p063MmPercent: 170,
  panPercent: 230,
} as const satisfies Record<keyof AfsGrainFinenessNumberArgs, number>

/**
 * Показник AFS
 * GFN = (Σ (fraction_i[%] * multiplier_i)) / 100  (од.)
 */
export const AFS_GRAIN_FINENESS_NUMBER_TRANSFORM: TransformSpec<AfsGrainFinenessNumberArgs> = {
  id: 'afsGrainFinenessNumber',
  inputs: INPUTS,
  compute(a) {
    const sum = INPUTS.reduce((acc, k) => acc + a[k] * MULTIPLYERS[k], 0)
    return sum / 100
  },
  unit: Units.PN,
}
