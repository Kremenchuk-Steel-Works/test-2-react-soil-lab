import type { Option } from '@/shared/ui/select/ReactSelect'
import type { ValueOf } from '@/types/utility'

export const MIXTURES = { '13': '13', '14': '14', '15': '15' } as const
export type MixtureKey = ValueOf<typeof MIXTURES>

export const samplesMixturesOptions: Option<MixtureKey>[] = [
  { value: '13', label: '13 (Наповнювальна)' },
  { value: '14', label: '14 (Облицювальна)' },
  { value: '15', label: '15 (Для освіження)' },
] as const
