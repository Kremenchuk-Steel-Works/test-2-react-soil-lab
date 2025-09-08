import z from 'zod'
import { MEASUREMENTS as FR } from '@/entities/soil-lab/measurements/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const measurementsBaseFormSchema = z.object({
  [FR.moldingSandNumber.key]: zn(z.string().min(1).max(50)),
  [FR.moldingSandStrengthKgfCm2.key]: zn(z.number().min(0).max(10)),
  [FR.moldingSandGasPermeability.key]: zn(z.number().min(0).max(200)),
  [FR.moldingSandMoisturePercent.key]: zn(z.number().min(0).max(10)),
  [FR.note.key]: zn(z.string().nullable().optional()),
})
