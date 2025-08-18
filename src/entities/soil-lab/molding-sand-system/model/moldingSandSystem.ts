import type { MoldingSandSystem } from '@/shared/api/mold-passport/model'
import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldingSandSystemOptions: Option<MoldingSandSystem>[] = [
  { value: 'layered', label: 'Облицювальна' },
  { value: 'unitary', label: 'Наповнювальна' },
] as const
