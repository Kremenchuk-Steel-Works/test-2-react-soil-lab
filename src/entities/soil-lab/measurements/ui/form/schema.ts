import z from 'zod'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const measurementsBaseFormSchema = z.object({
  moldingSandNumber: zn(z.string()),
  moldingSandStrengthKgfCm2: zn(z.number().min(0).max(10)),
  moldingSandGasPermeability: zn(z.number().min(0).max(200)),
  moldingSandMoisturePercent: zn(z.number().min(0).max(10)),
  note: zn(z.string().nullable().optional()),
})
