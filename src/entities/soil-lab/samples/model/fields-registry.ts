import type { SampleCreate, SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const samplesFieldRegistry = createFieldRegistry.forType<SampleCreate>()({
  moldingSandRecipe: {
    label: { default: 'Номер суміші' },
  },
  receivedAt: {
    label: { default: 'Дата створення' },
  },
  note: {
    label: { default: 'Примітка' },
  },
} as const)

export const samplesResponseFieldRegistry = createFieldRegistry.forType<SampleDetailResponse>()({
  moldingSandRecipe: samplesFieldRegistry.moldingSandRecipe,
  receivedAt: samplesFieldRegistry.receivedAt,
  note: samplesFieldRegistry.receivedAt,
  tests: {
    label: { default: 'Перелік випробувань' },
  },
} as const)
