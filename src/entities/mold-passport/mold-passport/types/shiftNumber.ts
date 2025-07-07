import type { Option } from '@/shared/ui/select/ReactSelect'

export const shiftNumberOptions: Option<number>[] = [
  { value: 1, label: '1 Зміна' },
  { value: 2, label: '2 Зміна' },
  { value: 3, label: '3 Зміна' },
] as const

export type ShiftNumber = (typeof shiftNumberOptions)[number]['value']
