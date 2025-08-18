import type { Option } from '@/shared/ui/select/ReactSelect'

export const patternPlateFrameStatusOptions: Option<string>[] = [
  { value: 'available', label: 'Доступна' },
  { value: 'under_maintenance', label: 'На технічному обслуговуванні' },
  { value: 'dismissed', label: 'Списана' },
] as const

export type PatternPlateFrameStatus = (typeof patternPlateFrameStatusOptions)[number]['value']
