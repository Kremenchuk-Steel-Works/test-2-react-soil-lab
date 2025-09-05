import type { Option } from '@/shared/ui/select/ReactSelect'

export const employeeProfileOptions: Option<string>[] = [
  { value: 'intern', label: 'Стажер' },
  { value: 'full-time', label: 'Повна зайнятість' },
  { value: 'part-time', label: 'Неповна зайнятість' },
  { value: 'contract', label: 'Контракт' },
  { value: 'on-leave', label: 'У відпустці' },
  { value: 'suspended', label: 'Призупинено' },
  { value: 'terminated', label: 'Звільнений' },
  { value: 'retired', label: 'На пенсії' },
] as const

export type EmploymentStatus = (typeof employeeProfileOptions)[number]['value']
