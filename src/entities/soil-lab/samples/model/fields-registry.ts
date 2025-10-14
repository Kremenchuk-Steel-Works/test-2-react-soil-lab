import type { SampleCreate, SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const samplesFieldRegistry = createFieldRegistry.forType<SampleCreate>()({
  materialId: {
    label: { default: 'Тип матеріалу' },
  },
  materialSourceId: {
    label: { default: 'Джерело матеріалу' },
  },
  temperature: {
    label: { default: 'Температура (°C)' },
  },
  receivedAt: {
    label: { default: 'Дата створення' },
  },
  note: {
    label: { default: 'Примітка' },
  },
} as const)

export const samplesResponseFieldRegistry = createFieldRegistry.forType<SampleDetailResponse>()({
  material: samplesFieldRegistry.materialId,
  materialSource: samplesFieldRegistry.materialSourceId,
  temperature: samplesFieldRegistry.temperature,
  receivedAt: samplesFieldRegistry.receivedAt,
  note: samplesFieldRegistry.receivedAt,
  testResults: {
    label: { default: 'Перелік випробувань' },
  },
} as const)
