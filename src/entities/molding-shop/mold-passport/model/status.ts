import type { AssetStatus } from '@/shared/api/mold-passport/model'
import type { Option } from '@/shared/ui/select/ReactSelect'

// export const moldPassportStatusOptions: Option<string>[] = [
//   { value: 'available', label: 'Доступна' },
//   { value: 'used', label: 'Використана' },
//   { value: 'defective', label: 'Брак' },
// ] as const

export type MoldPassportStatus = AssetStatus

export const moldPassportStatusOptions: Option<MoldPassportStatus>[] = [
  { value: 'available', label: 'Доступна' },
  { value: 'under_maintenance', label: 'На технічному обслуговуванні' },
  { value: 'dismissed', label: 'Списана' },
] as const
