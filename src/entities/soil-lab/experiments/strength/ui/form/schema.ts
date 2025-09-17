import z from 'zod'
import { strengthFieldRegistry } from '@/entities/soil-lab/experiments/strength/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, compressiveStrength } = strengthFieldRegistry

export const strengthBaseFormSchema = z.object({
  [moldingSandNumber.key]: zn(z.string()),
  [compressiveStrength.key]: zn(z.number().nullable().optional()),
})
