import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldingFlaskStatusOptions: Option<string>[] = [
  { value: 'available', label: 'Доступна' },
  { value: 'under_maintenance', label: 'На технічному обслуговуванні' },
  { value: 'dismissed', label: 'Списана' },
] as const

export type MoldingFlaskFrameStatus = (typeof moldingFlaskStatusOptions)[number]['value']
