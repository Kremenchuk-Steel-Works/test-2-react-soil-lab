import type { Option } from '@/shared/ui/select/ReactSelect'

export const resinTypeOptions: Option<string>[] = [
  { value: 'core', label: 'Стрижнева' },
  { value: 'universal', label: 'Універсальна' },
] as const

export type ResinType = (typeof resinTypeOptions)[number]['value']
