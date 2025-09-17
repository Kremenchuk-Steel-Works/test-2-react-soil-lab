import type { Option } from '@/shared/ui/select/ReactSelect'

export const MACHINE_TYPES = {
  mixer: 'mixer',
  afl2: 'afl2',
  afl3: 'afl3',
  halfForm: 'halfForm',
} as const
export type MachineType = (typeof MACHINE_TYPES)[keyof typeof MACHINE_TYPES]

export const experimentsMachineTypesOptions: Option<MachineType>[] = [
  { value: 'mixer', label: 'Змішувач' },
  { value: 'afl2', label: 'АФЛ 2' },
  { value: 'afl3', label: 'АФЛ 3' },
  { value: 'halfForm', label: 'З напівформи' },
] as const
