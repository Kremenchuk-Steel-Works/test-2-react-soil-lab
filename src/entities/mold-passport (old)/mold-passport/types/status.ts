import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldPassportStatusOptionsOld: Option<string>[] = [
  { value: 'available', label: 'Доступний' },
  { value: 'used', label: 'Використаний' },
  { value: 'defective', label: 'Брак' },
] as const

export type MoldPassportStatus = (typeof moldPassportStatusOptionsOld)[number]['value']
