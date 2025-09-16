import type { MixtureKey } from '@/entities/soil-lab/experiments/types/experiments-config'
import type { Option } from '@/shared/ui/select/ReactSelect'

export const experimentsMixturesOptions: Option<MixtureKey>[] = [
  { value: '13', label: '13 (Наповнювальна)' },
  { value: '14', label: '14 (Облицювальна)' },
  { value: '15', label: '15 (Для освіження)' },
] as const
