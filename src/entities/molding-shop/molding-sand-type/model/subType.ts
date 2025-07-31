import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldingSandSubTypeOptions: Option<string>[] = [
  { value: 'facing', label: 'Облицювальна' },
  { value: 'filler', label: 'Наповнювальна' },
] as const

export type MoldingSandSubType = (typeof moldingSandSubTypeOptions)[number]['value']
