import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldingAreaAdditionalOptions: Option<string>[] = [
  { value: 'full_size', label: 'Аеропрес' },
] as const

export type MoldingAreaAdditionalOptions = (typeof moldingAreaAdditionalOptions)[number]['value']
