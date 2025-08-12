import type { Option } from '@/shared/ui/select/ReactSelect'

export const castingProductTypeOptions: Option<string>[] = [
  { value: 'primary', label: 'Повнорозмірна деталь' },
  { value: 'auxiliary', label: 'Підсадка' },
  { value: 'heavy_section', label: 'Великогабаритна деталь' },
] as const

export type castingProductType = (typeof castingProductTypeOptions)[number]['value']
