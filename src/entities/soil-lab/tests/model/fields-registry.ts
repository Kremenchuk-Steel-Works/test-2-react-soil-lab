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
  strength: {
    label: {
      default: 'Міцність на стиск (кгс/см²)',
      defaultUnit: 'кгс/см²',
      nPerCm2: 'Міцність на стиск (Н/см²)',
      short: 'Міцність на стиск',
    },
  },
  gasPermeability: {
    label: {
      default: 'Газопроникність (од.)',
      defaultUnit: 'од.',
      m2PerPas: 'Газопроникність · 10⁻⁸ (m²/Pa·S)',
      short: 'Газопроникність',
    },
  },
  moisturePercent: {
    label: { default: 'Вологість (%)', defaultUnit: '%', short: 'Вологість' },
  },
  tensileStrength: {
    label: {
      default: 'Міцність на розрив у висушеному стані (МПа)',
      defaultUnit: 'МПа',
      short: 'Міцність на розрив у висушеному стані',
    },
  },
  tensileStrength0h: {
    label: {
      default: 'Міцність на розрив одразу  (МПа)',
      defaultUnit: 'МПа',
      short: 'Міцність на розрив одразу',
    },
  },
  tensileStrength1h: {
    label: {
      default: 'Міцність на розрив через 1 годину (МПа)',
      defaultUnit: 'МПа',
      short: 'Міцність на розрив через 1 годину',
    },
  },
  tensileStrength3h: {
    label: {
      default: 'Міцність на розрив через 3 години (МПа)',
      defaultUnit: 'МПа',
      short: 'Міцність на розрив через 3 години',
    },
  },
  tensileStrength24h: {
    label: {
      default: 'Міцність на розрив через 24 години (МПа)',
      defaultUnit: 'МПа',
      short: 'Міцність на розрив через 24 години',
    },
  },
  gasEvolution: {
    label: {
      default: 'Газоутворююча властивість (МПа)',
      defaultUnit: 'МПа',
      short: 'Газоутворююча властивість',
    },
  },
} as const)
