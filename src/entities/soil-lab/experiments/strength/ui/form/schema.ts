import z from 'zod'
import { strengthFieldRegistry } from '@/entities/soil-lab/experiments/strength/model/fields-registry'
import { experimentsBaseFormSchema } from '@/entities/soil-lab/experiments/ui/form/schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, machineType, compressiveStrength } = strengthFieldRegistry

export const strengthBaseFormSchema = experimentsBaseFormSchema
  .pick({
    [moldingSandNumber.key]: true,
    [machineType.key]: true,
  } as const)
  .merge(
    z.object({
      [compressiveStrength.key]: zn(z.number().nullable().optional()),
    }),
  )
