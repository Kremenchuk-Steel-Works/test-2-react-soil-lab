import type { MoldingSandSystem } from '@/shared/api/mold-passport/model'
import type { Option } from '@/shared/ui/select/ReactSelect'

// export const moldingSandSubTypeOptions: Option<string>[] = [
//   { value: 'facing', label: 'Облицювальна' },
//   { value: 'filler', label: 'Наповнювальна' },
// ] as const

// export type MoldingSandSubType = (typeof moldingSandSubTypeOptions)[number]['value']

export const moldingSandSystemOptions: Option<MoldingSandSystem>[] = [
  { value: 'layered', label: 'Облицювальна' },
  { value: 'unitary', label: 'Наповнювальна' },
] as const
