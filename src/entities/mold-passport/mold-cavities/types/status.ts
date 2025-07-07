import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldCoresStatusOptions: Option<string>[] = [
  { value: 'available', label: 'Доступний' },
  { value: 'used', label: 'Використаний' },
  { value: 'defective', label: 'Брак' },
] as const

export type MoldCoresStatus = (typeof moldCoresStatusOptions)[number]['value']
