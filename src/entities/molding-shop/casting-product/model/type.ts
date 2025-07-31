import type { Option } from '@/shared/ui/select/ReactSelect'

export const castingProductTypeOptions: Option<string>[] = [
  { value: 'full_size', label: 'Повнорозмірна деталь' },
  { value: 'riser_pad', label: 'Підсадка' },
  { value: 'oversized', label: 'Великогабаритна деталь' },
] as const

export type castingProductType = (typeof castingProductTypeOptions)[number]['value']
