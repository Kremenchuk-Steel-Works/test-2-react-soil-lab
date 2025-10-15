import type { TestResultCreate, TestResultDetailResponse } from '@/shared/api/soil-lab/model'
import { type SnakeToCamel } from '@/types/utility'
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

export const testsTypeFieldRegistry = createFieldRegistry.forKeys<SnakeToCamel<TestType>>()({
  compressiveStrength: {
    label: {
      default: 'Міцність на стиск (кгс/см²)',
      short: 'Міцність на стиск',
      defaultUnit: 'кгс/см²',
      nPerCm2: 'Міцність на стиск (Н/см²)',
    },
  },
  gasPermeability: {
    label: {
      default: 'Газопроникність (од.)',
      short: 'Газопроникність',
      defaultUnit: 'од.',
      m2PerPas: 'Газопроникність · 10⁻⁸ (m²/Pa·S)',
    },
  },
  moisturePercent: {
    label: { default: 'Вологість (%)', defaultUnit: '%', short: 'Вологість' },
  },
  tensileStrength: {
    label: {
      default: 'Міцність на розрив у висушеному стані (МПа)',
      short: 'Міцність на розрив у висушеному стані',
      defaultUnit: 'МПа',
    },
  },
  tensileStrengthAfter0Hours: {
    label: {
      default: 'Міцність на розрив одразу  (МПа)',
      short: 'Міцність на розрив одразу',
      defaultUnit: 'МПа',
    },
  },
  tensileStrengthAfter1Hour: {
    label: {
      default: 'Міцність на розрив через 1 годину (МПа)',
      short: 'Міцність на розрив через 1 годину',
      defaultUnit: 'МПа',
    },
  },
  tensileStrengthAfter3Hours: {
    label: {
      default: 'Міцність на розрив через 3 години (МПа)',
      short: 'Міцність на розрив через 3 години',
      defaultUnit: 'МПа',
    },
  },
  tensileStrengthAfter24Hours: {
    label: {
      default: 'Міцність на розрив через 24 години (МПа)',
      short: 'Міцність на розрив через 24 години',
      defaultUnit: 'МПа',
    },
  },
  gasFormingProperty: {
    label: {
      default: 'Газоутворююча властивість (МПа)',
      short: 'Газоутворююча властивість',
      defaultUnit: 'МПа',
    },
  },
} as const)
