import type { TestStatus } from '@/shared/api/soil-lab-2/model'
import type { Option } from '@/shared/ui/select/ReactSelect'

export const testsStatusOptions: Option<TestStatus>[] = [
  { value: 'passed', label: 'Пройдено' },
  { value: 'failed', label: 'Не пройдено' },
] as const
