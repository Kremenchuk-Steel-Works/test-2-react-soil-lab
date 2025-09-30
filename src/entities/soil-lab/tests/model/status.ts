import type { TestStatus } from '@/shared/api/soil-lab/model'
import { dictToOptions } from '@/utils/dict'

export const testsStatus: Record<TestStatus, string> = {
  passed: 'Пройдено',
  failed: 'Не пройдено',
} as const

export const testsStatusOptions = dictToOptions(testsStatus)
