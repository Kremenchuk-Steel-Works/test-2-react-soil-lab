import type { Option } from '@/shared/ui/select/ReactSelect'

export const MIXTURES = { '13': '13', '14': '14', '15': '15' } as const
export type MixtureKey = (typeof MIXTURES)[keyof typeof MIXTURES]

export const experimentsMixturesOptions: Option<MixtureKey>[] = [
  { value: '13', label: '13 (Наповнювальна)' },
  { value: '14', label: '14 (Облицювальна)' },
  { value: '15', label: '15 (Для освіження)' },
] as const
