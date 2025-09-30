import type { ValueOf } from '@/types/utility'
import { dictToOptions } from '@/utils/dict'

export const MIXTURES = { '13': '13', '14': '14', '15': '15' } as const
export type MixtureKey = ValueOf<typeof MIXTURES>

export const samplesMixtures: Record<MixtureKey, string> = {
  '13': '13 (Наповнювальна)',
  '14': '14 (Облицювальна)',
  '15': '15 (Для освіження)',
} as const

export const samplesMixturesOptions = dictToOptions(samplesMixtures)
