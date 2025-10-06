import type { TestCreate, TestDetailResponse, TestType } from '@/shared/api/soil-lab/model'
import { type SnakeToCamel } from '@/types/utility'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const testsFieldRegistry = createFieldRegistry.forType<TestCreate>()({
  sampleId: {
    label: { default: 'ID' },
  },
  type: {
    label: { default: 'Тип' },
  },
  measurement1: {
    label: { default: 'Вимірювання 1' },
  },
} as const)

export const testsResponseFieldRegistry = createFieldRegistry.forType<TestDetailResponse>()({
  type: testsFieldRegistry.type,
  createdAt: {
    label: { default: 'Дата створення' },
  },
  measurement1: testsFieldRegistry.measurement1,
  measurement2: {
    label: { default: 'Вимірювання 2' },
  },
  measurement3: {
    label: { default: 'Вимірювання 3' },
  },
  selectedMeasurement1: {
    label: { default: 'Обраний вимір 1' },
  },
  selectedMeasurement2: {
    label: { default: 'Обраний вимір 2' },
  },
  differencePercent: {
    label: { default: 'Різниця (%)' },
  },
  meanMeasurement: {
    label: { default: 'Середнє значення' },
  },
  lowerLimit: {
    label: { default: 'Мінімальне допустиме значення' },
  },
  upperLimit: {
    label: { default: 'Максимальне допустиме значення' },
  },
  status: {
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
