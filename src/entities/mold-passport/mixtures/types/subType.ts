import type { Option } from '@/shared/ui/select/ReactSelect'

export const mixtureSubTypeOptions: Option<string>[] = [
  { value: 'facing', label: 'Облицювальна' },
  { value: 'backfilling', label: 'Наповнювальна' },
] as const

export type MixtureSubType = (typeof mixtureSubTypeOptions)[number]['value']
