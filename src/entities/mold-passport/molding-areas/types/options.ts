import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldAreaAdditionalOptions: Option<string>[] = [
  { value: 'airpress', label: 'Аеропрес' },
] as const

export type MoldAreaAdditional = (typeof moldAreaAdditionalOptions)[number]['value']
