import z from 'zod'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import { experimentsBaseFormSchema } from '@/entities/soil-lab/experiments/ui/form/schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, machineType, ambientTempMoldAssemblyArea, moistureContentPercent } =
  moistureFieldRegistry

export const moistureBaseFormSchema = experimentsBaseFormSchema
  .pick({
    [moldingSandNumber.key]: true,
    [machineType.key]: true,
    [ambientTempMoldAssemblyArea.key]: true,
  } as const)
  .merge(
    z.object({
      [moistureContentPercent.key]: zn(z.number().nullable().optional()),
    }),
  )
