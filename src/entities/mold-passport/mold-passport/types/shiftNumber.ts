import type { Option } from '@/shared/ui/select/ReactSelect'

export const shiftNumberOptions: Option<number>[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
] as const

export type ShiftNumber = (typeof shiftNumberOptions)[number]['value']
