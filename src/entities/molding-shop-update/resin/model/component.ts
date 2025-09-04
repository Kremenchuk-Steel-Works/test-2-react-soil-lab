import type { Option } from '@/shared/ui/select/ReactSelect'

export const resinComponentOptions: Option<string>[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
] as const

export type ResinComponent = (typeof resinComponentOptions)[number]['value']
