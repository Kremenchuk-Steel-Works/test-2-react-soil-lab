import type { TestResultCreate, TestResultDetailResponse } from '@/shared/api/soil-lab/model'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const testsFieldRegistry = createFieldRegistry.forType<TestResultCreate>()({
  sampleId: {
    label: { default: 'ID Зразка' },
  },
  parameterId: {
    label: { default: 'ID Випробування' },
  },
  measurements: {
    label: { default: 'Вимірювання' },
  },
} as const)

export const testsResponseFieldRegistry = createFieldRegistry.forType<TestResultDetailResponse>()({
  parameter: testsFieldRegistry.parameterId,
  measurements: testsFieldRegistry.measurements,
  createdAt: {
    label: { default: 'Дата створення' },
  },
  meanValue: {
    label: { default: 'Середнє значення' },
  },
  variationPercentage: {
    label: { default: 'Різниця (%)' },
  },
  lowerLimit: {
    label: { default: 'Мінімальне допустиме значення' },
  },
  upperLimit: {
    label: { default: 'Максимальне допустиме значення' },
  },
  isCompliant: {
    label: { default: 'Статус' },
  },
} as const)
